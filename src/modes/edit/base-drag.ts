import { FeatureData } from '@/core/features/feature-data.ts';
import type {
  AnyEvent,
  EditModeName,
  FeatureShape,
  GeoJsonShapeFeature,
  LngLat,
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
import type { Feature, Polygon } from 'geojson';
import log from 'loglevel';
import { GM_PREFIX } from '@/core/constants.ts';
import { SOURCES } from '@/core/features/constants.ts';

type UpdateShapeHandler = (
  featureData: FeatureData,
  lngLatStart: LngLat,
  lngLatEnd: LngLat,
) => GeoJsonShapeFeature | null;

export abstract class BaseDrag extends BaseEdit {
  mode: EditModeName = 'drag';
  isDragging: boolean = false;
  previousLngLat: LngLat | null = null;

  pointBasedShapes: Array<FeatureShape> = ['marker', 'circle_marker', 'text_marker'];

  throttledMethods = convertToThrottled(
    {
      onMouseMove: this.onMouseMove,
    },
    this,
    this.gm.options.settings.throttlingDelay,
  );

  eventHandlers = {
    [`${GM_PREFIX}:edit`]: this.handleGmEdit.bind(this),

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

  onMouseDown(event: AnyEvent): MapHandlerReturnData {
    this.featureData = this.gm.features.getFeatureByMouseEvent({
      event,
      sourceNames: [SOURCES.main],
    });

    if (this.featureData && this.getUpdatedGeoJsonHandlers[this.featureData.shape]) {
      this.featureData.changeSource({ sourceName: SOURCES.temporary, atomic: true });
      this.gm.mapAdapter.setDragPan(false);
      this.isDragging = true;

      this.snappingHelper?.addExcludedFeature(this.featureData);
      if (this.isPointBasedShape()) {
        this.alignShapeCenterWithControlMarker(this.featureData, event);
      }
      this.fireFeatureEditStartEvent({ feature: this.featureData, forceMode: 'drag' });
      return { next: false };
    }
    return { next: true };
  }

  onMouseUp(): MapHandlerReturnData {
    if (!this.featureData) {
      return { next: true };
    }

    this.snappingHelper?.clearExcludedFeatures();
    this.featureData.changeSource({ sourceName: SOURCES.main, atomic: true });

    this.isDragging = false;
    this.previousLngLat = null;
    this.gm.mapAdapter.setDragPan(true);
    this.fireFeatureEditEndEvent({ feature: this.featureData, forceMode: 'drag' });
    this.featureData = null;
    return { next: true };
  }

  onMouseMove(event: AnyEvent): MapHandlerReturnData {
    if (!this.isDragging || !isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }

    if (this.featureData) {
      // marker pointer is automatically enabled when the drag starts
      // see "relatedModes" in options
      const endLngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();
      this.moveFeature(this.featureData, endLngLat);
    }
    return { next: false };
  }

  isPointBasedShape(): boolean {
    // snapping should be enabled only for point based geometries
    // but shape markers provide its own snapping too
    return !!this.featureData && this.pointBasedShapes.includes(this.featureData.shape);
  }

  abstract handleGmEdit(event: AnyEvent): MapHandlerReturnData;

  alignShapeCenterWithControlMarker(featureData: FeatureData, event: AnyEvent) {
    const shapeLngLat = getFeatureFirstPoint(featureData);
    if (shapeLngLat) {
      this.gm.markerPointer.marker?.setLngLat(shapeLngLat);
      this.onMouseMove(event); // align control marker and feature center
    }
  }

  moveFeature(featureData: FeatureData, newLngLat: LngLat) {
    if (!this.isDragging) {
      return;
    }

    if (!this.previousLngLat) {
      this.previousLngLat = newLngLat;
      return;
    }

    const shapeUpdateMethod = this.getUpdatedGeoJsonHandlers[featureData.shape];
    if (shapeUpdateMethod) {
      const updatedGeoJson = shapeUpdateMethod(featureData, this.previousLngLat, newLngLat);
      if (!updatedGeoJson) {
        log.error('BaseDrag.moveFeature: invalid updatedGeoJson', featureData);
        return;
      }

      this.fireBeforeFeatureUpdate({
        features: [featureData],
        geoJsonFeatures: [updatedGeoJson],
        forceMode: 'drag',
      });

      const isUpdated = this.updateFeatureGeoJson({
        featureData,
        featureGeoJson: updatedGeoJson,
        forceMode: 'drag',
      });

      if (isUpdated) {
        this.previousLngLat = newLngLat;
      }
    }
  }

  moveSource(featureData: FeatureData, oldLngLat: LngLat, newLngLat: LngLat) {
    const lngLatDiff = getLngLatDiff(oldLngLat, newLngLat);
    // moveFeatureData(featureData, lngLatDiff);
    return getMovedGeoJson(featureData, lngLatDiff);
  }

  moveEllipse(
    featureData: FeatureData,
    oldLngLat: LngLat,
    newLngLat: LngLat,
  ): GeoJsonShapeFeature | null {
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

    const lngLatDiff = getLngLatDiff(oldLngLat, newLngLat);

    const newCenterCoords: LngLat = [oldCenter[0] + lngLatDiff.lng, oldCenter[1] + lngLatDiff.lat];

    return getGeoJsonEllipse({
      center: newCenterCoords,
      xSemiAxis,
      ySemiAxis,
      angle,
    });
  }

  moveCircle(
    featureData: FeatureData,
    oldLngLat: LngLat,
    newLngLat: LngLat,
  ): GeoJsonShapeFeature | null {
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
    const lngLatDiff = getLngLatDiff(oldLngLat, newLngLat);
    const circleRimLngLat = getGeoJsonFirstPoint(geoJson);
    if (!circleRimLngLat) {
      log.error('BaseDrag.moveCircle: missing center circleRimLngLat');
      return null;
    }

    const newCenterCoords: LngLat = [
      shapeCenter[0] + lngLatDiff.lng,
      shapeCenter[1] + lngLatDiff.lat,
    ];
    featureData.setShapeProperty('center', newCenterCoords);

    const circlePolygon = getGeoJsonCircle({
      center: newCenterCoords,
      radius: this.gm.mapAdapter.getDistance(shapeCenter, circleRimLngLat),
    });

    return {
      type: 'Feature',
      properties: {
        shape: 'circle',
      },
      geometry: circlePolygon.geometry,
    };
  }
}
