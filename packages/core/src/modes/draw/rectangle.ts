import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { FEATURE_PROPERTY_PREFIX, SOURCES } from '@/core/features/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import type { GmDrawShapeEvent, GmDrawShapeEventWithData } from '@/types/events/draw.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLatTuple, ScreenPoint } from '@/types/map/index.ts';
import type { DrawModeName, MarkerData, ShapeName } from '@/types/modes/index.ts';

import { BaseDraw } from '@/modes/draw/base.ts';
import { convertToThrottled } from '@/utils/behavior.ts';
import { allCoordinatesEqual } from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import distance from '@turf/distance';
import type { ShapeGeoJsonProperties } from '@/types';

export class DrawRectangle extends BaseDraw {
  mode: DrawModeName = 'rectangle';
  shape: ShapeName = 'rectangle';
  startLngLat: LngLatTuple | null = null;

  eventHandlers = {
    mousemove: this.onMouseMove.bind(this),
    click: this.onMouseClick.bind(this),
  };
  throttledMethods = convertToThrottled(
    {
      updateFeaturePosition: this.updateFeaturePosition,
    },
    this,
    this.gm.options.settings.throttlingDelay,
  );

  onStartAction() {
    this.gm.markerPointer.enable();
  }

  async onEndAction() {
    await this.removeTmpFeature();
    this.startLngLat = null;
    this.gm.markerPointer.disable();
    await this.fireFinishEvent();
  }

  async onMouseClick(event: BaseMapEvent) {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: false };
    }

    this.gm.features.clearSelection();
    const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();

    if (this.startLngLat) {
      const geoJson = this.getFeatureGeoJson(this.startLngLat, lngLat);
      await this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

      if (this.flags.featureCreateAllowed) {
        await this.finishShape(lngLat);
      }
    } else {
      const geoJson = this.getFeatureGeoJson(lngLat, lngLat);
      await this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

      if (this.flags.featureCreateAllowed) {
        const featureData = await this.startShape(lngLat);
        if (featureData) {
          const markerData = this.getControlMarkerData(['geometry', 'coordinates', 4]);
          await this.fireStartEvent(featureData, markerData);
        }
      }
    }
    return { next: false };
  }

  async onMouseMove(event: BaseMapEvent) {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: false };
    }

    if (!this.startLngLat) {
      await this.fireMarkerPointerUpdateEvent();
      return { next: false };
    }

    const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();

    const geoJson = this.getFeatureGeoJson(this.startLngLat, lngLat);
    await this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

    if (this.flags.featureCreateAllowed) {
      await this.throttledMethods.updateFeaturePosition(this.startLngLat, lngLat);
    }
    return { next: false };
  }

  async startShape(lngLat: LngLatTuple) {
    this.startLngLat = lngLat;
    this.featureData = await this.createFeature(this.startLngLat, this.startLngLat);
    return this.featureData;
  }

  async finishShape(lngLat: LngLatTuple) {
    if (this.startLngLat) {
      await this.updateFeaturePosition(this.startLngLat, lngLat);
      this.updateFeatureProperties(this.startLngLat, lngLat);
    }

    if (this.featureData) {
      if (this.isFeatureGeoJsonValid()) {
        await this.saveFeature();
      } else {
        await this.removeTmpFeature();
      }
    }
    this.startLngLat = null;
    await this.fireFinishEvent();
  }

  async createFeature(startLngLat: LngLatTuple, endLngLat: LngLatTuple) {
    return this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson(startLngLat, endLngLat),
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

  getFeatureGeoJson(startLngLat: LngLatTuple, endLngLat: LngLatTuple): GeoJsonShapeFeature {
    const startPoint = this.gm.mapAdapter.project(startLngLat);
    const endPoint = this.gm.mapAdapter.project(endLngLat);

    const minX = Math.min(startPoint[0], endPoint[0]);
    const minY = Math.min(startPoint[1], endPoint[1]);
    const maxX = Math.max(startPoint[0], endPoint[0]);
    const maxY = Math.max(startPoint[1], endPoint[1]);

    return {
      type: 'Feature',
      properties: {
        [`${FEATURE_PROPERTY_PREFIX}shape`]: 'rectangle',
        [`${FEATURE_PROPERTY_PREFIX}center`]: [0, 0],
        [`${FEATURE_PROPERTY_PREFIX}angle`]: 0,
        [`${FEATURE_PROPERTY_PREFIX}width`]: 0,
        [`${FEATURE_PROPERTY_PREFIX}height`]: 0,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [minX, minY],
            [maxX, minY],
            [maxX, maxY],
            [minX, maxY],
            [minX, minY],
          ].map((point) => this.gm.mapAdapter.unproject(point as ScreenPoint)),
        ],
      },
    };
  }

  getFeatureProperties(startPoint: ScreenPoint, endPoint: ScreenPoint): ShapeGeoJsonProperties {
    const minX = Math.min(startPoint[0], endPoint[0]);
    const minY = Math.min(startPoint[1], endPoint[1]);
    const maxX = Math.max(startPoint[0], endPoint[0]);
    const maxY = Math.max(startPoint[1], endPoint[1]);
    const center: ScreenPoint = [(minX + maxX) / 2, (minY + maxY) / 2];
    const dimensions = this.getRectangleDimensions(startPoint, endPoint, center);

    return {
      [`${FEATURE_PROPERTY_PREFIX}shape`]: 'rectangle',
      [`${FEATURE_PROPERTY_PREFIX}center`]: this.gm.mapAdapter.unproject(center),
      [`${FEATURE_PROPERTY_PREFIX}angle`]: 0,
      [`${FEATURE_PROPERTY_PREFIX}width`]: dimensions.width,
      [`${FEATURE_PROPERTY_PREFIX}height`]: dimensions.height,
    };
  }

  getRectangleDimensions(startPoint: ScreenPoint, endPoint: ScreenPoint, center: ScreenPoint) {
    const centerLngLat = this.gm.mapAdapter.unproject(center);

    const horizontalCenter = this.gm.mapAdapter.unproject([
      (startPoint[0] + endPoint[0]) / 2,
      startPoint[1],
    ]);

    const verticalCenter = this.gm.mapAdapter.unproject([
      startPoint[0],
      (startPoint[1] + endPoint[1]) / 2,
    ]);

    const width = 2 * distance(centerLngLat, verticalCenter, { units: 'meters' });
    const height = 2 * distance(centerLngLat, horizontalCenter, { units: 'meters' });

    return { width, height };
  }

  async updateFeaturePosition(startLngLat: LngLatTuple, endLngLat: LngLatTuple) {
    if (!this.featureData) {
      return;
    }

    const geoJson: GeoJsonShapeFeature = this.getFeatureGeoJson(startLngLat, endLngLat);

    await this.featureData.updateGeometry(geoJson.geometry);
    const markerData = this.getControlMarkerData(['geometry', 'coordinates', 4]);
    await this.fireUpdateEvent(this.featureData, markerData);
  }

  updateFeatureProperties(startLngLat: LngLatTuple, endLngLat: LngLatTuple) {
    const startPoint = this.gm.mapAdapter.project(startLngLat);
    const endPoint = this.gm.mapAdapter.project(endLngLat);

    const properties = this.getFeatureProperties(startPoint, endPoint);
    this.featureData?._updateAllProperties(properties);
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

  async fireStartEvent(featureData: FeatureData, markerData: MarkerData | null) {
    const event: GmDrawShapeEventWithData = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
      level: 'system',
      actionType: 'draw',
      mode: this.shape,
      variant: null,
      action: 'start',
      featureData,
      markerData,
    };
    await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, event);
  }

  async fireUpdateEvent(featureData: FeatureData, markerData: MarkerData | null) {
    const event: GmDrawShapeEventWithData = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
      level: 'system',
      actionType: 'draw',
      mode: this.shape,
      variant: null,
      action: 'update',
      featureData,
      markerData,
    };
    await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, event);
  }

  async fireFinishEvent() {
    const event: GmDrawShapeEvent = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape`,
      level: 'system',
      actionType: 'draw',
      mode: this.shape,
      variant: null,
      action: 'finish',
    };
    await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, event);
  }
}
