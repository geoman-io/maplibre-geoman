import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { SOURCES } from '@/core/features/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import type {
  DrawModeName,
  GeoJsonShapeFeature,
  GmDrawShapeEvent,
  GmDrawShapeEventWithData,
  LngLatTuple,
  MarkerData,
  ShapeName,
} from '@/main.ts';

import { BaseDraw } from '@/modes/draw/base.ts';
import { convertToThrottled } from '@/utils/behavior.ts';
import {
  allCoordinatesEqual,
  getBboxFromTwoCoords,
  twoCoordsToGeoJsonRectangle,
} from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import type { BBox } from 'geojson';

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

    const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();

    if (this.startLngLat) {
      const geoJson = this.getFeatureGeoJson(getBboxFromTwoCoords(this.startLngLat, lngLat));
      await this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

      if (this.flags.featureCreateAllowed) {
        await this.finishShape(lngLat);
      }
    } else {
      const geoJson = this.getFeatureGeoJson(getBboxFromTwoCoords(lngLat, lngLat));
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
    const bounds = getBboxFromTwoCoords(this.startLngLat, lngLat);

    const geoJson = this.getFeatureGeoJson(bounds);
    await this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

    if (this.flags.featureCreateAllowed) {
      await this.throttledMethods.updateFeaturePosition(bounds);
    }
    return { next: false };
  }

  async startShape(lngLat: LngLatTuple) {
    this.startLngLat = lngLat;
    const bounds = getBboxFromTwoCoords(this.startLngLat, this.startLngLat);
    this.featureData = await this.createFeature(bounds);
    return this.featureData;
  }

  async finishShape(lngLat: LngLatTuple) {
    if (this.startLngLat) {
      const bounds = getBboxFromTwoCoords(this.startLngLat, lngLat);
      await this.throttledMethods.updateFeaturePosition(bounds);
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

  async createFeature(bounds: BBox) {
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
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    );

    return {
      ...rectangleGeoJson,
      properties: {
        shape: this.shape,
      },
    };
  }

  async updateFeaturePosition(bounds: BBox) {
    if (!this.featureData) {
      return;
    }

    const rectangleData: GeoJsonShapeFeature = twoCoordsToGeoJsonRectangle(
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    );
    await this.featureData.updateGeometry(rectangleData.geometry);
    const markerData = this.getControlMarkerData(['geometry', 'coordinates', 4]);
    await this.fireUpdateEvent(this.featureData, markerData);
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
