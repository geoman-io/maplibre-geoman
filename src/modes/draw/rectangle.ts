import { gmPrefix } from '@/core/events/listeners/base.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import { SOURCES } from '@/core/features/index.ts';
import type {
  AnyEvent,
  DrawModeName,
  GeoJsonShapeFeature,
  GMDrawShapeEvent,
  GMDrawShapeEventWithData,
  LngLat,
  MapHandlerReturnData,
  MarkerData,
  ShapeName,
} from '@/main.ts';

import { BaseDraw } from '@/modes/draw/base.ts';
import { convertToThrottled } from '@/utils/behavior.ts';
import { allCoordinatesEqual, getBboxFromTwoCoords, twoCoordsToGeoJsonRectangle } from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BBox } from 'geojson';


export class DrawRectangle extends BaseDraw {
  mode: DrawModeName = 'rectangle';
  shape: ShapeName = 'rectangle';
  startLngLat: LngLat | null = null;

  mapEventHandlers = {
    mousemove: this.onMouseMove.bind(this),
    click: this.onMouseClick.bind(this),
  };
  throttledMethods = convertToThrottled({
    updateFeaturePosition: this.updateFeaturePosition,
  }, this, this.gm.options.settings.throttlingDelay);

  onStartAction() {
    this.gm.markerPointer.enable();
  }

  onEndAction() {
    this.removeTmpFeature();
    this.startLngLat = null;
    this.gm.markerPointer.disable();
    this.fireFinishEvent();
  }

  onMouseClick(event: AnyEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: false };
    }

    const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();

    if (this.startLngLat) {
      const geoJson = this.getFeatureGeoJson(
        getBboxFromTwoCoords(this.startLngLat, lngLat),
      );
      this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

      if (this.flags.featureCreateAllowed) {
        this.finishShape(lngLat);
      }
    } else {
      const geoJson = this.getFeatureGeoJson(
        getBboxFromTwoCoords(lngLat, lngLat),
      );
      this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

      if (this.flags.featureCreateAllowed) {
        const featureData = this.startShape(lngLat);
        if (featureData) {
          const markerData = this.getControlMarkerData(['geometry', 'coordinates', 4]);
          this.fireStartEvent(featureData, markerData);
        }
      }
    }
    return { next: false };
  }

  onMouseMove(event: AnyEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: false };
    }

    if (!this.startLngLat) {
      this.fireMarkerPointerUpdateEvent();
      return { next: false };
    }

    const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();
    const bounds = getBboxFromTwoCoords(this.startLngLat, lngLat);

    const geoJson = this.getFeatureGeoJson(bounds);
    this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

    if (this.flags.featureCreateAllowed) {
      this.throttledMethods.updateFeaturePosition(bounds);
    }
    return { next: false };
  }

  startShape(lngLat: LngLat) {
    this.startLngLat = lngLat;
    const bounds = getBboxFromTwoCoords(this.startLngLat, this.startLngLat);
    this.featureData = this.createFeature(bounds);
    return this.featureData;
  }

  finishShape(lngLat: LngLat) {
    if (this.startLngLat) {
      const bounds = getBboxFromTwoCoords(this.startLngLat, lngLat);
      this.throttledMethods.updateFeaturePosition(bounds);
    }

    if (this.featureData) {
      if (this.isFeatureGeoJsonValid()) {
        this.saveFeature();
      } else {
        this.removeTmpFeature();
      }
    }
    this.startLngLat = null;
    this.fireFinishEvent();
  }

  createFeature(bounds: BBox): FeatureData | null {
    return this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson(bounds),
      sourceName: SOURCES.temporary,
    });
  }

  isFeatureGeoJsonValid(): boolean {
    if (!this.featureData) {
      return false;
    }

    // for now only checks if all points aren't the same
    return allCoordinatesEqual(this.featureData.getGeoJson());
  }

  getFeatureGeoJson(bounds: BBox): GeoJsonShapeFeature {
    const rectangleGeoJson = twoCoordsToGeoJsonRectangle(
      [bounds[0], bounds[2]],
      [bounds[2], bounds[3]],
    );

    return {
      ...rectangleGeoJson,
      properties: {
        shape: this.shape,
      },
    };
  }

  updateFeaturePosition(bounds: BBox) {
    if (!this.featureData) {
      return;
    }

    const rectangleData: GeoJsonShapeFeature = twoCoordsToGeoJsonRectangle(
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    );
    this.featureData.updateGeoJsonGeometry(rectangleData.geometry);
    const markerData = this.getControlMarkerData(['geometry', 'coordinates', 4]);
    this.fireUpdateEvent(this.featureData, markerData);
  }

  getControlMarkerData(path: Array<string | number>): MarkerData | null {
    const controlMarker = this.gm.markerPointer.marker;
    if (!controlMarker) {
      return null;
    }

    return {
      type: 'dom',
      instance: controlMarker,
      position: {
        coordinate: controlMarker.getLngLat(),
        path,
      },
    };
  }

  fireStartEvent(
    featureData: FeatureData,
    markerData: MarkerData | null,
  ) {
    const event: GMDrawShapeEventWithData = {
      level: 'system',
      type: 'draw',
      mode: this.shape,
      variant: null,
      action: 'start',
      featureData,
      markerData,
    };
    this.gm.events.fire(`${gmPrefix}:draw`, event);
  }

  fireUpdateEvent(
    featureData: FeatureData,
    markerData: MarkerData | null,
  ) {
    const event: GMDrawShapeEventWithData = {
      level: 'system',
      type: 'draw',
      mode: this.shape,
      variant: null,
      action: 'update',
      featureData,
      markerData,
    };
    this.gm.events.fire(`${gmPrefix}:draw`, event);
  }

  fireFinishEvent() {
    const event: GMDrawShapeEvent = {
      level: 'system',
      type: 'draw',
      mode: this.shape,
      variant: null,
      action: 'finish',
    };
    this.gm.events.fire(`${gmPrefix}:draw`, event);
  }
}
