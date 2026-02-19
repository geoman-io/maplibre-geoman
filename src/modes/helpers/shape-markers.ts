import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import {
  type DomMarkerData,
  type EdgeMarkerData,
  type EditModeName,
  type FeatureShape,
  type GmEditFeatureUpdatedEvent,
  type GmEditMarkerEvent,
  type GmEditMarkerMoveEvent,
  type GmSystemEvent,
  type HelperModeName,
  type LngLatTuple,
  type MapHandlerReturnData,
  type MarkerData,
  type PositionData,
  type ScreenPoint,
  type SegmentPosition,
  SOURCES,
} from '@/main.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';
import type { SharedMarker } from '@/types/interfaces.ts';
import { convertToDebounced, convertToThrottled } from '@/utils/behavior.ts';
import { findInCollection } from '@/utils/collections.ts';
import { getFeatureFirstPoint } from '@/utils/features.ts';
import { eachSegmentWithPath, findCoordinateWithPath, isEqualPosition } from '@/utils/geojson.ts';
import { isPinHelper } from '@/utils/guards/interfaces.ts';
import { isMapPointerEvent, isPointerEventWithModifiers } from '@/utils/guards/map.ts';
import { isGmDrawEvent, isGmEditEvent } from '@/utils/guards/modes.ts';
import type { BaseMapEvent, BaseMapPointerEvent } from '@mapLib/types/events.ts';
import { cloneDeep, intersection } from 'lodash-es';
import log from 'loglevel';

type SegmentData = {
  segment: SegmentPosition;
  middle: PositionData;
  edgeMarkerKey: string;
};

type CreateMarkerParams = {
  type: MarkerData['type'];
  positionData: PositionData;
  parentFeature: FeatureData;
  segment?: EdgeMarkerData['segment'];
};

export class ShapeMarkersHelper extends BaseHelper {
  mode: HelperModeName = 'shape_markers';
  pinEnabled: boolean = this.gm.options.controls.helper.pin?.active || false;
  previousPosition: LngLatTuple | null = null;
  activeMarker: MarkerData | null = null;
  activeFeatureData: FeatureData | null = null;
  sharedMarkers: Array<SharedMarker> = [];
  allowedShapes: Array<FeatureShape> = ['circle', 'line', 'rectangle', 'polygon', 'ellipse'];
  edgeMarkersAllowed: boolean = false;
  edgeMarkerAllowedShapes: Array<FeatureShape> = ['line', 'rectangle', 'polygon'];
  shapeMarkerAllowedModes: Array<EditModeName> = ['drag', 'change', 'cut', 'split'];
  eventHandlers = {
    [`${GM_SYSTEM_PREFIX}:draw`]: this.handleGmDraw.bind(this),
    [`${GM_SYSTEM_PREFIX}:edit`]: this.handleGmEdit.bind(this),

    mousedown: this.onMouseDown.bind(this),
    touchstart: this.onMouseDown.bind(this),

    mouseup: this.onMouseUp.bind(this),
    touchend: this.onMouseUp.bind(this),

    mousemove: this.onMouseMove.bind(this),
    touchmove: this.onMouseMove.bind(this),

    contextmenu: this.onMouseRightButtonClick.bind(this),
  };
  throttledMethods = convertToThrottled(
    {
      sendMarkerMoveEvent: this.sendMarkerMoveEvent,
      sendMarkerRightClickEvent: this.sendMarkerRightClickEvent,
    },
    this,
    this.gm.options.settings.throttlingDelay,
  );

  debouncedMethods = convertToDebounced(
    {
      refreshMarkers: this.refreshMarkers,
    },
    this,
    this.gm.options.settings.throttlingDelay * 10,
  );

  get pinHelperInstance() {
    if (!this.pinEnabled) {
      return null;
    }

    return Object.values(this.gm.actionInstances).find(isPinHelper) || null;
  }

  async onStartAction() {
    if (this.isShapeMarkerAllowed()) {
      this.gm.markerPointer.enable({ invisibleMarker: true });
    }

    this.edgeMarkersAllowed = this.gm.getActiveEditModes().includes('change');
    this.gm.features.updateManager.beginTransaction('transactional-set', SOURCES.internal);
    await this.addMarkers();
    this.gm.features.updateManager.commitTransaction(SOURCES.internal);
  }

  async onEndAction() {
    this.gm.markerPointer.disable();

    this.gm.features.updateManager.beginTransaction('transactional-set', SOURCES.internal);
    await this.removeMarkers();
    this.gm.features.updateManager.commitTransaction(SOURCES.internal);
  }

  setPin(enabled: boolean) {
    this.pinEnabled = enabled;
  }

  async onMouseDown(event: BaseMapEvent) {
    const allowedEventNames = ['mousedown', 'touchstart'];
    if (
      !isMapPointerEvent(event, { warning: true }) ||
      !allowedEventNames.includes(event.type) ||
      isPointerEventWithModifiers(event)
    ) {
      return { next: true };
    }
    if (event.type === 'mousedown' && event.originalEvent.button !== 0) {
      // todo: check for right button click in other places like this
      return { next: true };
    }

    const featureMarkerData = this.getFeatureMarkerByMouseEvent(event);
    this.activeMarker = featureMarkerData || null;
    this.activeFeatureData = featureMarkerData?.instance.parent || null;

    if (!(this.activeMarker && this.activeFeatureData)) {
      return { next: true };
    }

    this.previousPosition = getFeatureFirstPoint(this.activeMarker.instance);
    this.gm.mapAdapter.setDragPan(false);

    if (this.activeMarker.type === 'edge') {
      await this.sendMarkerEvent('edge_marker_click', this.activeFeatureData, this.activeMarker);
    }

    if (this.pinEnabled && this.pinHelperInstance) {
      this.sharedMarkers = this.pinHelperInstance.getSharedMarkers(
        this.activeMarker.position.coordinate,
      );
      this.sharedMarkers.forEach((sharedMarker) =>
        this.snappingHelper?.addExcludedFeature(sharedMarker.featureData),
      );
    } else {
      this.snappingHelper?.addExcludedFeature(this.activeFeatureData);
    }

    await this.sendMarkerEvent('marker_captured', this.activeFeatureData, this.activeMarker);
    return { next: false };
  }

  async onMouseUp() {
    if (!this.activeMarker) {
      return { next: true };
    }

    const eventData = {
      featureData: this.activeFeatureData,
      markerData: this.activeMarker,
    };

    this.activeMarker = null;
    this.activeFeatureData = null;
    this.sharedMarkers = [];
    this.snappingHelper?.clearExcludedFeatures();
    this.previousPosition = null;
    this.gm.mapAdapter.setDragPan(true);

    if (eventData.featureData && eventData.markerData) {
      await this.sendMarkerEvent('marker_released', eventData.featureData, eventData.markerData);
      return { next: false };
    } else {
      log.debug('ShapeMarkersHelper.onMouseUp: no active marker or featureData', eventData);
    }

    return { next: true };
  }

  onMouseMove(event: BaseMapEvent): MapHandlerReturnData {
    if (!this.activeMarker || !isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }

    this.throttledMethods.sendMarkerMoveEvent(event);
    return { next: false };
  }

  onMouseRightButtonClick(event: BaseMapEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }

    const featureMarkerData = this.getFeatureMarkerByMouseEvent(event);

    if (featureMarkerData && featureMarkerData.instance.parent) {
      this.throttledMethods.sendMarkerRightClickEvent(
        featureMarkerData.instance.parent,
        featureMarkerData,
      );
      return { next: false };
    }

    return { next: true };
  }

  isShapeMarkerAllowed() {
    return intersection(this.shapeMarkerAllowedModes, this.gm.getActiveEditModes()).length > 0;
  }

  async convertToVertexMarker(markerData: MarkerData) {
    if (markerData.type === 'edge' && markerData.instance.parent) {
      const oldPosition = markerData.position;
      const featureData = markerData.instance.parent;
      await this.removeMarker(markerData);

      const newMarkerData = await this.createMarker({
        type: 'vertex',
        positionData: oldPosition,
        parentFeature: featureData,
      });

      const shapeGeoJson = featureData.getGeoJson();
      const position = findCoordinateWithPath(shapeGeoJson, oldPosition.coordinate);

      if (position) {
        const markerKey = position.path.join('.');
        const existingMarker = featureData.markers.get(markerKey);
        if (existingMarker) {
          await this.removeMarker(existingMarker);
        }

        featureData.markers.set(markerKey, newMarkerData);
        return newMarkerData;
      }
    }

    log.error('ShapeMarkersHelper.convertToVertexMarker: invalid marker type', markerData);
    return markerData;
  }

  getFeatureMarkerByMouseEvent(
    event: BaseMapPointerEvent,
  ): Exclude<MarkerData, DomMarkerData> | null {
    const markerFeatureData = this.gm.features.getFeatureByMouseEvent({
      event,
      sourceNames: [SOURCES.internal],
    });

    if (markerFeatureData?.parent?.markers) {
      const markerData = findInCollection(
        markerFeatureData.parent.markers,
        (item) => item.instance === markerFeatureData,
      );
      if (markerData?.type !== 'dom') {
        return markerData;
      }
    }
    return null;
  }

  async addMarkers() {
    for (const [, featureData] of this.gm.features.featureStore) {
      if (
        !featureData ||
        featureData.temporary ||
        !this.allowedShapes.includes(featureData.shape) ||
        featureData.getShapeProperty('disableEdit') === true
      ) {
        continue;
      }

      await this.addCenterMarker(featureData);
      const shapeSegments = this.getAllShapeSegments(featureData);

      const endMarkerIndexes = this.getEndMarkerIndexes(featureData);

      for (const [index, segmentData] of shapeSegments.entries()) {
        // generic vertex marker
        const isVertexMarkerAllowed = this.isMarkerIndexAllowed(
          featureData.shape,
          index,
          shapeSegments.length,
        );

        if (isVertexMarkerAllowed) {
          const marker = await this.createOrUpdateVertexMarker(
            segmentData.segment.start,
            featureData,
          );
          featureData.markers.set(marker.markerKey, marker.markerData);

          if (endMarkerIndexes.has(index)) {
            const lineEndMarker = await this.createOrUpdateVertexMarker(
              segmentData.segment.end,
              featureData,
            );
            featureData.markers.set(lineEndMarker.markerKey, lineEndMarker.markerData);
          }
        }

        // edge middle marker
        if (this.isEdgeMarkerAllowed(featureData)) {
          const marker = await this.createOrUpdateEdgeMarker(segmentData, featureData);
          featureData.markers.set(marker.markerKey, marker.markerData);
        }
      }
    }
  }

  async addCenterMarker(featureData: FeatureData) {
    const shapeCenter = featureData.getShapeProperty('center');
    if (shapeCenter) {
      const markerData = await this.createMarker({
        type: 'center',
        positionData: {
          path: [],
          coordinate: shapeCenter,
        },
        parentFeature: featureData,
      });
      featureData.markers.set('center', markerData);
    }
  }

  getAllShapeSegments(featureData: FeatureData) {
    const shapeGeoJson = featureData.getGeoJson();
    const segmentsData: Array<SegmentData> = [];

    eachSegmentWithPath(shapeGeoJson, (segment, index) => {
      segmentsData.push({
        segment,
        middle: this.getSegmentMiddlePosition(segment),
        edgeMarkerKey: this.getEdgeMarkerKey(index),
      });
    });
    return segmentsData;
  }

  isEdgeMarkerAllowed(featureData: FeatureData) {
    return this.edgeMarkersAllowed && this.edgeMarkerAllowedShapes.includes(featureData.shape);
  }

  isMarkerIndexAllowed(shape: FeatureData['shape'], markerIndex: number, verticesCount: number) {
    // allows 4 markers for a circle's rim
    const divider = Math.floor(verticesCount / 4);

    if (shape === 'circle') {
      return (markerIndex + divider / 2) % divider === 0;
    } else if (shape === 'ellipse') {
      return markerIndex % divider === 0;
    } else {
      return true;
    }
  }

  getEdgeMarkerKey(index: number) {
    return `edge.${index}`;
  }

  getEndMarkerIndexes(featureData: FeatureData): Set<number> {
    const geometry = featureData.getGeoJson().geometry;

    if (
      featureData.shape !== 'line' ||
      !['LineString', 'MultiLineString'].includes(geometry.type)
    ) {
      return new Set();
    }

    if (geometry.type === 'MultiLineString') {
      const infos = geometry.coordinates.reduce<{
        sum: number;
        indexes: Set<number>;
      }>(
        (acc, line) => {
          acc.indexes.add(acc.sum + line.length - 2);
          acc.sum += line.length - 1;
          return acc;
        },
        { sum: 0, indexes: new Set<number>() },
      );
      return infos.indexes;
    }
    return new Set([geometry.coordinates.length - 2]);
  }

  getSegmentMiddlePosition(segment: SegmentPosition): PositionData {
    const startPoint = this.gm.mapAdapter.project(segment.start.coordinate);
    const endPoint = this.gm.mapAdapter.project(segment.end.coordinate);

    const middlePoint: ScreenPoint = [
      (startPoint[0] + endPoint[0]) / 2,
      (startPoint[1] + endPoint[1]) / 2,
    ];
    const middlePath = segment.start.path.slice(0, segment.start.path.length - 1).concat([-1]);
    return {
      coordinate: this.gm.mapAdapter.unproject(middlePoint),
      path: middlePath,
    };
  }

  async removeMarkers() {
    this.gm.features.forEach((_, featureId) => {
      const featureData = this.gm.features.get(SOURCES.main, featureId);

      if (featureData) {
        featureData.markers.forEach((marker) => {
          if (marker.type !== 'dom') {
            this.gm.features.delete(marker.instance);
          } else {
            log.error('Non a FeatureData marker', marker);
          }
        });
        featureData.markers = new Map();
      }
    });
  }

  async removeMarker(markerData: MarkerData) {
    if (markerData.type === 'dom') {
      log.error('Wrong marker type', markerData);
      return;
    }

    const featureData = markerData.instance.parent;
    if (!featureData) {
      log.error('Missing parent feature data', markerData);
      return;
    }

    for (const [key, markerItem] of featureData.markers.entries()) {
      if (markerItem === markerData) {
        await this.gm.features.delete(markerItem.instance);
        featureData.markers.delete(key);
        break;
      }
    }
  }

  async handleGmDraw(event: GmSystemEvent) {
    if (!isGmDrawEvent(event)) {
      log.error('ShapeMarkersHelper.handleGmDraw: not a draw event', event);
      return { next: true };
    }

    if (['feature_created', 'mode_start'].includes(event.action)) {
      await this.debouncedMethods.refreshMarkers();
    }

    return { next: true };
  }

  async refreshMarkers() {
    const isEnabled = this.gm.options.isModeEnabled('helper', 'shape_markers');

    if (isEnabled) {
      this.gm.features.updateManager.beginTransaction('transactional-set', SOURCES.internal);
      await this.removeMarkers();
      await this.addMarkers();
      this.gm.features.updateManager.commitTransaction(SOURCES.internal);
    }
  }

  async handleGmEdit(event: GmSystemEvent) {
    if (!isGmEditEvent(event)) {
      log.error('ShapeMarkersHelper.handleGmEdit: not an edit event', event);
      return { next: true };
    }

    if (event.action === 'feature_updated') {
      await this.handleShapeUpdate(event);
    }

    return { next: true };
  }

  async handleShapeUpdate(event: GmEditFeatureUpdatedEvent) {
    const featureData = event.targetFeatures[0];

    if (!featureData) {
      log.error('ShapeMarkersHelper.handleShapeUpdate: no featureData', event);
      return;
    }

    if (this.activeMarker?.type === 'edge') {
      this.activeMarker = await this.convertToVertexMarker(this.activeMarker);
    }

    const shapeSegments = this.getAllShapeSegments(featureData);
    const currentMarkerKeys = new Set(featureData.markers.keys());

    const endMarkerIndexes = this.getEndMarkerIndexes(featureData);

    for (const [index, segmentData] of shapeSegments.entries()) {
      const isVertexMarkerAllowed = this.isMarkerIndexAllowed(
        featureData.shape,
        index,
        shapeSegments.length,
      );

      if (isVertexMarkerAllowed) {
        const marker = await this.createOrUpdateVertexMarker(
          segmentData.segment.start,
          featureData,
        );
        currentMarkerKeys.delete(marker.markerKey);
        if (endMarkerIndexes.has(index)) {
          const lineEndMarker = await this.createOrUpdateVertexMarker(
            segmentData.segment.end,
            featureData,
          );
          currentMarkerKeys.delete(lineEndMarker.markerKey);
        }
      }

      if (this.isEdgeMarkerAllowed(featureData)) {
        const marker = await this.createOrUpdateEdgeMarker(segmentData, featureData);
        currentMarkerKeys.delete(marker.markerKey);
      }
    }

    await this.updateCenterMarkerPosition(featureData);
    currentMarkerKeys.delete('center');

    for (const markerKey of currentMarkerKeys) {
      const markerData = featureData.markers.get(markerKey);
      if (markerData && markerData.type !== 'dom') {
        await this.gm.features.delete(markerData.instance);
      } else {
        log.error('Non a FeatureData marker');
      }
      featureData.markers.delete(markerKey);
    }
  }

  async createOrUpdateVertexMarker(position: PositionData, featureData: FeatureData) {
    const markerKey = position.path.join('.');
    let markerData = featureData.markers.get(markerKey) || null;

    if (markerData && markerData?.type !== 'vertex') {
      throw new Error(`Invalid marker type "${markerData?.type}" for edge marker`);
    }

    if (markerData) {
      if (!isEqualPosition(markerData.position.coordinate, position.coordinate)) {
        await this.gm.features.updateMarkerFeaturePosition(
          markerData.instance,
          position.coordinate,
        );
      }
      markerData.position = position;
    } else {
      markerData = await this.createMarker({
        type: 'vertex',
        positionData: position,
        parentFeature: featureData,
      });
      featureData.markers.set(markerKey, markerData);
    }
    return { markerKey, markerData };
  }

  async createOrUpdateEdgeMarker(segmentData: SegmentData, featureData: FeatureData) {
    let markerData = featureData.markers.get(segmentData.edgeMarkerKey) || null;

    if (markerData && markerData?.type !== 'edge') {
      throw new Error(`Invalid marker type "${markerData?.type}" for edge marker`);
    }

    if (markerData) {
      if (!isEqualPosition(markerData.position.coordinate, segmentData.middle.coordinate)) {
        await markerData.instance.updateGeometry({
          type: 'Point',
          coordinates: segmentData.middle.coordinate,
        });
      }
      markerData.position = segmentData.middle;
      markerData.segment = segmentData.segment;
    } else {
      markerData = await this.createMarker({
        type: 'edge',
        positionData: segmentData.middle,
        segment: segmentData.segment,
        parentFeature: featureData,
      });
      featureData.markers.set(segmentData.edgeMarkerKey, markerData);
    }

    return { markerKey: segmentData.edgeMarkerKey, markerData };
  }

  async updateCenterMarkerPosition(featureData: FeatureData) {
    const markerData = featureData.markers.get('center') || null;
    const shapeCenter = featureData.getShapeProperty('center');

    if (markerData && markerData.type !== 'dom' && shapeCenter) {
      await markerData.instance.updateGeometry({
        type: 'Point',
        coordinates: shapeCenter,
      });
      markerData.position.coordinate = shapeCenter;
    }
  }

  async sendMarkerEvent(
    action: GmEditMarkerEvent['action'],
    featureData: FeatureData,
    markerData: MarkerData,
  ) {
    const payload: GmEditMarkerEvent = {
      name: `${GM_SYSTEM_PREFIX}:edit:marker`,
      level: 'system',
      actionType: 'edit',
      mode: 'change',
      action,
      featureData,
      markerData,
    };
    await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:edit`, payload);
  }

  async sendMarkerRightClickEvent(featureData: FeatureData, markerData: MarkerData) {
    const payload: GmEditMarkerEvent = {
      name: `${GM_SYSTEM_PREFIX}:edit:marker`,
      level: 'system',
      actionType: 'edit',
      mode: 'change',
      action: 'marker_right_click',
      featureData,
      markerData,
    };
    await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:edit`, payload);
  }

  async sendMarkerMoveEvent(event: BaseMapPointerEvent) {
    const markerLngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();

    if (this.activeMarker && this.activeFeatureData) {
      const targetMarkers = this.pinEnabled
        ? this.sharedMarkers
        : [
            {
              markerData: this.activeMarker,
              featureData: this.activeFeatureData,
            },
          ];

      for (const item of targetMarkers) {
        if (this.previousPosition) {
          const payload: GmEditMarkerMoveEvent = {
            name: `${GM_SYSTEM_PREFIX}:edit:marker_move`,
            level: 'system',
            actionType: 'edit',
            mode: 'drag',
            action: 'marker_move',
            featureData: item.featureData,
            markerData: item.markerData,
            lngLatStart: this.previousPosition,
            lngLatEnd: markerLngLat,
          };
          await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:edit`, payload);
        }
      }
    }

    this.previousPosition = markerLngLat;
  }

  protected async createMarker({
    type,
    segment,
    positionData,
    parentFeature,
  }: CreateMarkerParams): Promise<MarkerData> {
    const coordinate = positionData.coordinate;

    const featureData = await this.gm.features.createMarkerFeature({
      sourceName: SOURCES.internal,
      parentFeature,
      type,
      coordinate,
    });
    if (!featureData) {
      throw new Error(`Missine feature data for the "${type}" marker`);
    }

    if (type === 'edge' && segment) {
      return {
        type,
        instance: featureData,
        position: cloneDeep(positionData),
        segment,
      };
    } else if (type === 'vertex' || type === 'center') {
      return {
        type,
        instance: featureData,
        position: cloneDeep(positionData),
      };
    } else {
      throw new Error(`Invalid marker type "${type}" with segment: ${segment}`);
    }
  }
}
