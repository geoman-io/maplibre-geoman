import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import { BaseDomMarker } from '@/core/map/base/marker.ts';
import {
  type DrawModeName,
  type GeoJsonLineFeature,
  type GeoJsonShapeFeature,
  type Geoman,
  type GmDrawLineDrawerEventWithData,
  type GmSystemEvent,
  type LineEventHandlerArguments,
  type LngLatTuple,
  type MapHandlerReturnData,
  type MarkerData,
  type MarkerId,
  type ShapeName,
  SOURCES,
} from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';

import { convertToThrottled } from '@/utils/behavior.ts';
import { getGeoJsonBounds, lngLatToGeoJsonPoint } from '@/utils/geojson.ts';
import { isGmHelperEvent } from '@/utils/guards/events/helper.ts';
import { isAutoTraceHelper, isSnapGuidesHelper } from '@/utils/guards/interfaces.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapEvent, BaseMapPointerEvent } from '@mapLib/types/events.ts';
import lineToPolygon from '@turf/line-to-polygon';
import type { Position } from 'geojson';
import log from 'loglevel';

type LineDrawerOptions = {
  snappingMarkers: 'first' | 'last' | 'all' | 'none';
  targetShape: Extract<ShapeName, 'line' | 'polygon'>;
};

type MarkerInfo = {
  index: number;
  path: MarkerId | null;
};

type MarkerHandler = ({
  markerIndex,
  shapeCoordinates,
  geoJson,
}: LineEventHandlerArguments) => void;

interface DrawerHandlers {
  // when the line is closed to its beginning (polygon is finished)
  firstMarkerClick: MarkerHandler | null;
  // when the last marker is clicked (line is finished)
  lastMarkerClick: MarkerHandler | null;
  // any marker is clicked to analyse for special cases
  nMarkerClick: MarkerHandler | null;
}

export class LineDrawer extends BaseDraw {
  mode: DrawModeName = 'line';
  snappingKey = 'line_drawer';
  drawOptions: LineDrawerOptions;
  shapeLngLats: Array<LngLatTuple> = [];

  throttledMethods = convertToThrottled(
    {
      onMouseMove: this.onMouseMove,
    },
    this,
    this.gm.options.settings.throttlingDelay,
  );

  eventHandlers = {
    [`${GM_SYSTEM_PREFIX}:helper`]: this.handleGmHelperEvent.bind(this),
    click: this.onMouseClick.bind(this),
    mousemove: this.throttledMethods.onMouseMove.bind(this),
  };

  drawerEventHandlers: DrawerHandlers = {
    firstMarkerClick: null,
    lastMarkerClick: null,
    nMarkerClick: null,
  };

  constructor(
    gm: Geoman,
    options: LineDrawerOptions = {
      snappingMarkers: 'none',
      targetShape: 'line',
    },
  ) {
    super(gm);
    this.drawOptions = options;
  }

  get snapGuidesInstance() {
    const instance = this.gm.actionInstances.helper__snap_guides;
    return isSnapGuidesHelper(instance) ? instance : null;
  }

  get autoTraceEnabled(): boolean {
    return this.gm.options.controls.helper.auto_trace?.active || false;
  }

  get autoTraceHelperInstance() {
    if (!this.autoTraceEnabled) {
      return null;
    }
    return Object.values(this.gm.actionInstances).find(isAutoTraceHelper) || null;
  }

  onStartAction() {
    this.gm.markerPointer.enable();
  }

  onEndAction() {
    this.gm.markerPointer.disable();
    this.endShape();
    this.snapGuidesInstance?.removeSnapGuides();
    this.clearDrawerHandlers();
  }

  clearDrawerHandlers() {
    this.drawerEventHandlers.firstMarkerClick = null;
    this.drawerEventHandlers.lastMarkerClick = null;
    this.drawerEventHandlers.nMarkerClick = null;
  }

  handleGmHelperEvent(event: GmSystemEvent): MapHandlerReturnData {
    if (!isGmHelperEvent(event)) {
      log.error('LineDrawer.handleGmHelperEvent: invalid event', event);
      return { next: true };
    }

    if (event.mode === 'snap_guides' && event.action === 'mode_start') {
      this.updateSnapGuides();
    }

    return { next: true };
  }

  updateSnapGuides() {
    if (this.snapGuidesInstance) {
      const shapeGeoJson = this.featureData?.getGeoJson();
      if (shapeGeoJson) {
        // line drawer has a control marker at the end, so it should be removed
        shapeGeoJson.geometry.coordinates.pop();
      }

      this.snapGuidesInstance.updateSnapGuides(
        shapeGeoJson || null,
        this.shapeLngLats.at(-1) || null,
        true,
      );
    }
  }

  on<T extends keyof DrawerHandlers>(eventType: T, handler: DrawerHandlers[T]) {
    this.drawerEventHandlers[eventType] = handler;
  }

  onMouseClick(event: BaseMapEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }
    // we use a marker lngLat since it's auto adjusted when snapping is enabled
    const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();

    if (this.featureData) {
      const markerInfo = this.getClickedMarkerInfo(event);
      this.handleNextVertex(lngLat, markerInfo);
    } else if (this.isFeatureAllowed(lngLatToGeoJsonPoint(lngLat))) {
      this.gm.features.clearSelection();
      this.startShape(lngLat);
    }

    this.updateSnapGuides();
    return { next: true };
  }

  handleNextVertex(lngLat: LngLatTuple, clickedMarkerInfo: MarkerInfo) {
    if (!this.featureData) {
      log.error('LineDrawer.handleNextVertex: no featureData');
      return;
    }

    const totalMarkersCount = this.featureData.markers.size;
    const eventData = this.getMarkerClickEventData(clickedMarkerInfo.index);

    if (clickedMarkerInfo.index < totalMarkersCount - 1) {
      // a point should be added all cases except the last marker clicked (including -1 index)
      this.addPoint(lngLat, clickedMarkerInfo);
    }

    if (clickedMarkerInfo.index === -1) {
      return;
    }

    if (clickedMarkerInfo.index === 0) {
      this.drawerEventHandlers.firstMarkerClick?.(eventData);
    } else if (clickedMarkerInfo.index > 0 && clickedMarkerInfo.index === totalMarkersCount - 1) {
      this.drawerEventHandlers.lastMarkerClick?.(eventData);
    }

    if (clickedMarkerInfo.index >= 0) {
      this.drawerEventHandlers.nMarkerClick?.(eventData);
    }
  }

  getMarkerClickEventData(markerIndex: number): LineEventHandlerArguments {
    const featureGeoJson = this.getFeatureGeoJson({ withControlMarker: false });
    return {
      markerIndex,
      shapeCoordinates: this.getShapeCoordinates({ withControlMarker: false }),
      geoJson: featureGeoJson,
      bounds: getGeoJsonBounds(featureGeoJson),
    };
  }

  onMouseMove(event: BaseMapEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }

    if (this.featureData && this.shapeLngLats.length) {
      this.updateFeatureSource();
    }
    return { next: true };
  }

  startShape(startLngLat: LngLatTuple) {
    this.shapeLngLats = [startLngLat];

    this.featureData = this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson({ withControlMarker: true }),
      sourceName: SOURCES.temporary,
    });

    const markerData: MarkerData = {
      type: 'dom',
      instance: this.createMarker(startLngLat),
      position: {
        coordinate: startLngLat,
        path: ['geometry', 'coordinates', 0],
      },
    };

    if (this.featureData) {
      this.featureData.markers.set(markerData.position.path.join('.'), markerData);

      this.setSnapping();
      this.fireStartEvent(this.featureData, markerData);
    }
    this.gm.mapAdapter.disableMapInteractions(['doubleClickZoom']);
  }

  endShape() {
    const featureGeoJson = this.getFeatureGeoJson({ withControlMarker: false });

    this.removeSnapping();
    this.removeTmpFeature();
    this.shapeLngLats = [];
    this.gm.mapAdapter.enableMapInteractions(['doubleClickZoom']);
    this.fireStopEvent(featureGeoJson);
  }

  setSnapping() {
    if (!this.snappingHelper) {
      return;
    }
    const snappingMarkers = this.drawOptions.snappingMarkers;

    if (snappingMarkers === 'none') {
      this.snappingHelper.setCustomSnappingCoordinates(this.snappingKey, []);
    } else if (snappingMarkers === 'all' && this.shapeLngLats.length) {
      this.snappingHelper.setCustomSnappingCoordinates(this.snappingKey, this.shapeLngLats);
    } else if (snappingMarkers === 'first' && this.shapeLngLats.length) {
      this.snappingHelper.setCustomSnappingCoordinates(this.snappingKey, [this.shapeLngLats[0]]);
    } else if (snappingMarkers === 'last' && this.shapeLngLats.length) {
      this.snappingHelper.setCustomSnappingCoordinates(this.snappingKey, [
        this.shapeLngLats[this.shapeLngLats.length - 1],
      ]);
    } else {
      log.error('LineDrawer.setSnapping: invalid data', snappingMarkers, this.shapeLngLats);
    }
  }

  removeSnapping() {
    if (!this.snappingHelper) {
      return;
    }
    this.snappingHelper.clearCustomSnappingCoordinates(this.snappingKey);
  }

  getClickedMarkerInfo(event: BaseMapPointerEvent): MarkerInfo {
    if (!this.featureData) {
      return { index: -1, path: null };
    }

    let markerIndex = 0;
    let markerPath: string | null = null;

    try {
      this.featureData.markers.forEach((markerData, key) => {
        if (markerData.instance instanceof BaseDomMarker) {
          const markerElement = markerData.instance.getElement() || null;
          const eventTarget = event.originalEvent.target;
          const eventElement = eventTarget instanceof Element ? eventTarget : null;

          if (markerElement && markerElement.contains(eventElement)) {
            markerPath = key;
            throw new Error('stop');
          }
        }
        markerIndex += 1;
      });
    } catch {
      if (markerPath) {
        return { index: markerIndex, path: markerPath };
      }
    }

    return { index: -1, path: null };
  }

  addPoint(newLngLat: LngLatTuple, existingMarkerInfo: MarkerInfo) {
    const featureData = this.featureData;
    if (!featureData) {
      log.error('LineDrawer.addPoint: no featureData');
      return;
    }

    const addedLngLats = this.getAddedLngLats(newLngLat, existingMarkerInfo);
    const featureGeoJson = this.getFeatureGeoJsonWithType({
      withControlMarker: true,
      coordinates: this.shapeLngLats.concat(addedLngLats),
    });

    if (this.isFeatureAllowed(featureGeoJson)) {
      addedLngLats.forEach((lngLat) => {
        this.shapeLngLats.push(lngLat);
        const markerData = this.addMarker(lngLat, featureData);
        this.fireUpdateEvent(featureData, markerData);
      });
      this.updateFeatureSource();
    }
  }

  isFeatureAllowed(featureGeoJson: GeoJsonShapeFeature) {
    if (this.gm.getActiveDrawModes().length) {
      this.fireBeforeFeatureCreate({ geoJsonFeatures: [featureGeoJson] });
      return this.flags.featureCreateAllowed;
    }

    return true;
  }

  getAddedLngLats(newLngLat: LngLatTuple, existingMarkerInfo: MarkerInfo) {
    const featureData = this.featureData;
    if (!featureData) {
      log.error('LineDrawer.getCurrentLngLats: no featureData');
      return [];
    }

    const targetLngLat = this.getMarkerInfoLngLat(existingMarkerInfo) || newLngLat;
    const pathPositions = this.getAutoTracePath(targetLngLat);

    return [...(pathPositions?.slice(1, -1) || []), targetLngLat];
  }

  getAutoTracePath(finishLngLat: LngLatTuple): Array<LngLatTuple> | null {
    const previousLngLat = this.shapeLngLats.at(-1);
    if (this.autoTraceEnabled && this.autoTraceHelperInstance && previousLngLat) {
      const path = this.autoTraceHelperInstance.getShortestPath(previousLngLat, finishLngLat);
      return path || null;
    }
    return null;
  }

  getMarkerInfoLngLat(markerInfo: MarkerInfo): LngLatTuple | null {
    if (this.featureData && markerInfo.path) {
      const markerData = this.featureData.markers.get(markerInfo.path);
      if (markerData && markerData.type === 'dom') {
        return markerData.instance.getLngLat();
      } else {
        log.error('LineDrawer.addPoint: no markerData', markerInfo);
      }
    }
    return null;
  }

  addMarker(lngLat: LngLatTuple, featureData: FeatureData): MarkerData {
    const markerData: MarkerData = {
      type: 'dom',
      instance: this.createMarker(lngLat),
      position: {
        coordinate: lngLat,
        path: ['geometry', 'coordinates', this.shapeLngLats.length],
      },
    };

    featureData.markers.set(markerData.position.path.join('.'), {
      type: 'dom',
      instance: markerData.instance,
      position: {
        coordinate: lngLat,
        path: [],
      },
    });

    return markerData;
  }

  createMarker(lngLat: LngLatTuple) {
    return this.gm.mapAdapter.createDomMarker(
      {
        element: this.gm.createSvgMarkerElement('control', {
          pointerEvents: 'auto',
          cursor: 'pointer',
        }),
        anchor: 'center',
      },
      lngLat,
    );
  }

  updateFeatureSource() {
    if (!this.featureData) {
      return;
    }

    this.featureData.updateGeoJsonGeometry(
      this.getFeatureGeoJson({ withControlMarker: true }).geometry,
    );

    if (this.gm.markerPointer.marker) {
      const markerData: MarkerData = {
        type: 'dom',
        instance: this.gm.markerPointer.marker,
        position: {
          coordinate: this.gm.markerPointer.marker.getLngLat(),
          path: ['geometry', 'coordinates', this.shapeLngLats.length],
        },
      };

      this.fireUpdateEvent(this.featureData, markerData);
    }
  }

  getFeatureGeoJson({
    withControlMarker,
    coordinates = undefined,
  }: {
    withControlMarker: boolean;
    coordinates?: Array<Position>;
  }): GeoJsonLineFeature {
    return {
      type: 'Feature',
      properties: {
        shape: 'line',
      },
      geometry: {
        type: 'LineString',
        coordinates: coordinates || this.getShapeCoordinates({ withControlMarker }),
      },
    };
  }

  getFeatureGeoJsonWithType({
    withControlMarker,
    coordinates = undefined,
  }: {
    withControlMarker: boolean;
    coordinates?: Array<Position>;
  }) {
    const featureGeoJson = this.getFeatureGeoJson({ withControlMarker, coordinates });

    if (
      this.drawOptions.targetShape === 'polygon' &&
      featureGeoJson.geometry.coordinates.length > 3
    ) {
      return lineToPolygon(featureGeoJson, {
        properties: featureGeoJson.properties,
      }) as GeoJsonShapeFeature;
    }

    return featureGeoJson;
  }

  getShapeCoordinates({ withControlMarker }: { withControlMarker: boolean }): Array<LngLatTuple> {
    const coordinates = [...this.shapeLngLats];

    if (withControlMarker && this.gm.markerPointer.marker) {
      coordinates.push(this.gm.markerPointer.marker.getLngLat());
    }

    return coordinates;
  }

  fireStartEvent(featureData: FeatureData, markerData: MarkerData) {
    const payload: GmDrawLineDrawerEventWithData = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
      level: 'system',
      actionType: 'draw',
      mode: 'line',
      variant: 'line_drawer',
      action: 'start',
      featureData,
      markerData,
    };

    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, payload);
  }

  fireUpdateEvent(featureData: FeatureData, markerData: MarkerData) {
    const payload: GmDrawLineDrawerEventWithData = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
      level: 'system',
      actionType: 'draw',
      mode: 'line',
      variant: 'line_drawer',
      action: 'update',
      featureData,
      markerData,
    };
    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, payload);
  }

  fireStopEvent(featureGeoJson: GeoJsonLineFeature) {
    const payload: GmDrawLineDrawerEventWithData = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
      level: 'system',
      actionType: 'draw',
      mode: 'line',
      action: 'finish',
      variant: 'line_drawer',
      geoJsonFeature: featureGeoJson,
      markerData: null,
      featureData: null,
    };

    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, payload);
  }
}
