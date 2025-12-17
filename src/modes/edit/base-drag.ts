import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { SOURCES } from '@/core/features/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import type {
  EditModeName,
  FeatureShape,
  GeoJsonShapeFeature,
  GmSystemEvent,
  LngLatDiff,
  LngLatTuple,
  MapHandlerReturnData,
} from '@/main.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { convertToThrottled } from '@/utils/behavior.ts';
import { getFeatureFirstPoint, getMovedGeoJson } from '@/utils/features.ts';
import {
  getGeoJsonCircle,
  getGeoJsonEllipse,
  getGeoJsonFirstPoint,
  getLngLatDiff,
} from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import type { Feature, Polygon } from 'geojson';
import { isEqual } from 'lodash-es';
import log from 'loglevel';

type UpdateShapeHandler = (
  featureData: FeatureData,
  lngLatDiff: LngLatDiff,
) => GeoJsonShapeFeature | null;

export abstract class BaseDrag extends BaseEdit {
  mode: EditModeName = 'drag';
  previousLngLat: LngLatTuple | null = null;
  linkedFeatures: Array<FeatureData> = [];

  pointBasedShapes: Array<FeatureShape> = ['marker', 'circle_marker', 'text_marker'];

  throttledMethods = convertToThrottled(
    {
      onMouseMove: this.onMouseMove,
    },
    this,
    this.gm.options.settings.throttlingDelay,
  );

  eventHandlers = {
    [`${GM_SYSTEM_PREFIX}:edit`]: this.handleGmEdit.bind(this),

    mousedown: this.onMouseDown.bind(this),
    touchstart: this.onMouseDown.bind(this),

    mousemove: this.throttledMethods.onMouseMove.bind(this),
    touchmove: this.throttledMethods.onMouseMove.bind(this),

    mouseup: this.onMouseUp.bind(this),
    touchend: this.onMouseUp.bind(this),
  };

  getUpdatedGeoJsonHandlers: { [key in FeatureShape]?: UpdateShapeHandler } = {
    marker: this.moveSource.bind(this),
    ellipse: this.moveEllipse.bind(this),
    circle: this.moveCircle.bind(this),
    circle_marker: this.moveSource.bind(this),
    text_marker: this.moveSource.bind(this),
    line: this.moveSource.bind(this),
    rectangle: this.moveSource.bind(this),
    polygon: this.moveSource.bind(this),
  };

  onMouseDown(event: BaseMapEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event)) {
      return { next: true };
    }
    const featureData = this.getFeatureByMouseEvent({ event, sourceNames: [SOURCES.main] });

    if (featureData && this.getUpdatedGeoJsonHandlers[featureData.shape]) {
      this.featureData = featureData;
      this.linkedFeatures = this.gm.features.getLinkedFeatures(featureData).filter((f) => {
        // what if linked feature has edit disabled and not the principal feature ?
        return f.getShapeProperty('disableEdit') !== true;
      });
      this.gm.mapAdapter.setDragPan(false);

      [this.featureData, ...this.linkedFeatures].map((featureData) => {
        featureData.changeSource({ sourceName: SOURCES.temporary, atomic: true });
        this.snappingHelper?.addExcludedFeature(featureData);
        // Fire dragstart BEFORE setting actionInProgress and aligning shapes.
        // This ensures correct internal event ordering: dragstart -> drag -> dragend.
        // alignShapeCenterWithControlMarker calls onMouseMove which can fire drag events,
        // so dragstart must be fired first.
        this.fireFeatureEditStartEvent({ feature: featureData, forceMode: 'drag' });
      });
      this.flags.actionInProgress = true;

      if (this.isPointBasedShape()) {
        this.alignShapeCenterWithControlMarker(this.featureData, event);
      }
      return { next: false };
    }
    return { next: true };
  }

  onMouseUp(event: BaseMapEvent): MapHandlerReturnData {
    if (!this.featureData || !isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }

    this.snappingHelper?.clearExcludedFeatures();

    this.gm.mapAdapter.setDragPan(true);
    this.flags.actionInProgress = false;

    [this.featureData, ...this.linkedFeatures].map((featureData) => {
      featureData.changeSource({ sourceName: SOURCES.main, atomic: true });
      this.fireFeatureEditEndEvent({ feature: featureData, forceMode: 'drag' });
    });

    this.previousLngLat = null;
    this.featureData = null;
    this.linkedFeatures = [];
    return { next: true };
  }

  onMouseMove(event: BaseMapEvent): MapHandlerReturnData {
    if (!this.flags.actionInProgress || !isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }

    // marker pointer is automatically enabled when the drag starts
    // see "relatedModes" in options
    const lngLatEnd = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();
    const lngLatStart = this.previousLngLat ?? lngLatEnd;

    const lngLatDiff = getLngLatDiff(lngLatStart, lngLatEnd);

    if (this.featureData) {
      this.linkedFeatures.map((featureData) => {
        this.moveFeature(featureData, lngLatDiff);
      });

      const isUpdated = this.moveFeature(this.featureData, lngLatDiff);
      if (isUpdated) {
        this.previousLngLat = lngLatEnd;
      }
    }

    return { next: false };
  }

  isPointBasedShape(): boolean {
    // snapping should be enabled only for point based geometries
    // but shape markers provide its own snapping too
    return !!this.featureData && this.pointBasedShapes.includes(this.featureData.shape);
  }

  abstract handleGmEdit(event: GmSystemEvent): MapHandlerReturnData;

  alignShapeCenterWithControlMarker(featureData: FeatureData, event: BaseMapEvent) {
    const shapeLngLat = getFeatureFirstPoint(featureData);
    if (shapeLngLat) {
      this.gm.markerPointer.marker?.setLngLat(shapeLngLat);
      this.onMouseMove(event); // align control marker and feature center
    }
  }

  moveFeature(featureData: FeatureData, lngLatDiff: LngLatDiff) {
    let isUpdated = false;

    if (!this.flags.actionInProgress) {
      return;
    }

    const shapeUpdateMethod = this.getUpdatedGeoJsonHandlers[featureData.shape];
    if (shapeUpdateMethod) {
      const updatedGeoJson = shapeUpdateMethod(featureData, lngLatDiff);
      if (!updatedGeoJson) {
        log.error('BaseDrag.moveFeature: invalid updatedGeoJson', featureData);
        return;
      }

      this.fireBeforeFeatureUpdate({
        features: [featureData],
        geoJsonFeatures: [updatedGeoJson],
        forceMode: 'drag',
      });

      isUpdated = this.updateFeatureGeoJson({
        featureData,
        featureGeoJson: updatedGeoJson,
        forceMode: 'drag',
      });
      if (!isEqual(featureData.getGeoJson().properties, updatedGeoJson.properties)) {
        featureData._updateAllProperties(updatedGeoJson.properties);
      }
    }

    return isUpdated;
  }

  moveSource(featureData: FeatureData, lngLatDiff: LngLatDiff) {
    // moveFeatureData(featureData, lngLatDiff);
    return getMovedGeoJson(featureData, lngLatDiff);
  }

  moveEllipse(featureData: FeatureData, lngLatDiff: LngLatDiff): GeoJsonShapeFeature | null {
    if (featureData.shape !== 'ellipse') {
      log.error('BaseDrag.moveCircle: invalid shape type', featureData);
      return null;
    }

    const oldCenter = featureData.getShapeProperty('center');
    const xSemiAxis = featureData.getShapeProperty('xSemiAxis');
    const ySemiAxis = featureData.getShapeProperty('ySemiAxis');
    const angle = featureData.getShapeProperty('angle');

    if (
      !Array.isArray(oldCenter) ||
      typeof xSemiAxis !== 'number' ||
      typeof ySemiAxis !== 'number' ||
      typeof angle !== 'number'
    ) {
      log.error(
        'BaseDrag.moveEllipse: missing center, xSemiAxis, ySemiAxis or angle in the featureData',
        featureData,
      );
      return null;
    }

    const newCenterCoords: LngLatTuple = [
      oldCenter[0] + lngLatDiff.lng,
      oldCenter[1] + lngLatDiff.lat,
    ];

    return getGeoJsonEllipse({
      center: newCenterCoords,
      xSemiAxis,
      ySemiAxis,
      angle,
    });
  }

  moveCircle(featureData: FeatureData, lngLatDiff: LngLatDiff): GeoJsonShapeFeature | null {
    if (featureData.shape !== 'circle') {
      log.error('BaseDrag.moveCircle: invalid shape type', featureData);
      return null;
    }

    const shapeCenter = featureData.getShapeProperty('center');
    if (!Array.isArray(shapeCenter)) {
      log.error('BaseDrag.moveCircle: missing center in the featureData', featureData);
      return null;
    }

    const geoJson = featureData.getGeoJson() as Feature<Polygon>;
    const circleRimLngLat = getGeoJsonFirstPoint(geoJson);
    if (!circleRimLngLat) {
      log.error('BaseDrag.moveCircle: missing center circleRimLngLat');
      return null;
    }

    const newCenterCoords: LngLatTuple = [
      shapeCenter[0] + lngLatDiff.lng,
      shapeCenter[1] + lngLatDiff.lat,
    ];
    featureData.setShapeProperty('center', newCenterCoords);

    const circlePolygon = getGeoJsonCircle({
      center: newCenterCoords,
      radius: this.gm.mapAdapter.getDistance(shapeCenter, circleRimLngLat),
    });

    return circlePolygon;
  }
}
