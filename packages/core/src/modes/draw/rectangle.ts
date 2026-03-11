import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { SOURCES } from '@/core/features/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import type { GmDrawShapeEvent, GmDrawShapeEventWithData } from '@/types/events/draw.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLatTuple } from '@/types/map/index.ts';
import type { DrawModeName, MarkerData, ShapeName } from '@/types/modes/index.ts';

import { BaseDraw } from '@/modes/draw/base.ts';
import { convertToThrottled } from '@/utils/behavior.ts';
import { propertiesValid } from '@/utils/features.ts';
import { allCoordinatesNotEqual } from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import { getRectangleGeoJson } from '@/utils/shapes.ts';

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
      const geoJson = getRectangleGeoJson({
        startLngLat: this.startLngLat,
        endLngLat: lngLat,
        withProperties: true,
        mapAdapter: this.gm.mapAdapter,
      });
      await this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

      if (this.flags.featureCreateAllowed) {
        await this.finishShape(lngLat);
      }
    } else {
      const geoJson = getRectangleGeoJson({
        startLngLat: lngLat,
        endLngLat: lngLat,
        withProperties: false,
        mapAdapter: this.gm.mapAdapter,
      });

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

    const geoJson = getRectangleGeoJson({
      startLngLat: this.startLngLat,
      endLngLat: lngLat,
      withProperties: false,
      mapAdapter: this.gm.mapAdapter,
    });

    await this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

    if (this.flags.featureCreateAllowed) {
      await this.throttledMethods.updateFeaturePosition(this.startLngLat, lngLat);
    }
    return { next: false };
  }

  async startShape(lngLat: LngLatTuple) {
    this.startLngLat = lngLat;
    const shapeGeoJson = getRectangleGeoJson({
      startLngLat: this.startLngLat,
      endLngLat: this.startLngLat,
      withProperties: false,
      mapAdapter: this.gm.mapAdapter,
    });

    this.featureData = await this.gm.features.createFeature({
      shapeGeoJson,
      sourceName: SOURCES.temporary,
    });
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

  isFeatureGeoJsonValid(): boolean {
    if (!this.featureData) {
      return false;
    }

    // for now only checks if all points aren't the same
    return (
      allCoordinatesNotEqual(this.featureData.getGeoJson()) &&
      propertiesValid(this.featureData.getGeoJson(), this.shape)
    );
  }

  async updateFeaturePosition(startLngLat: LngLatTuple, endLngLat: LngLatTuple) {
    if (!this.featureData) {
      return;
    }

    const geoJson: GeoJsonShapeFeature = getRectangleGeoJson({
      startLngLat,
      endLngLat,
      withProperties: false,
      mapAdapter: this.gm.mapAdapter,
    });

    await this.featureData.updateGeometry(geoJson.geometry);
    const markerData = this.getControlMarkerData(['geometry', 'coordinates', 4]);
    await this.fireUpdateEvent(this.featureData, markerData);
  }

  updateFeatureProperties(startLngLat: LngLatTuple, endLngLat: LngLatTuple) {
    const geoJson = getRectangleGeoJson({
      startLngLat,
      endLngLat,
      withProperties: true,
      mapAdapter: this.gm.mapAdapter,
    });

    this.featureData?._updateAllProperties(geoJson.properties);
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
