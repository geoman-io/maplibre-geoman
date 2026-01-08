import type { DrawModeName, LngLatTuple, MapHandlerReturnData, ShapeName } from '@/main.ts';
import { BaseCircle } from '@/modes/draw/base-circle.ts';
import { convertToThrottled } from '@/utils/behavior.ts';
import { allCoordinatesEqual, getGeoJsonCircle } from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapPointerEvent } from '@mapLib/types/events.ts';

export class DrawCircle extends BaseCircle {
  mode: DrawModeName = 'circle';
  shape: ShapeName = 'circle';

  throttledMethods = convertToThrottled(
    {
      updateFeatureGeoJson: this.updateFeatureGeoJson,
    },
    this,
    this.gm.options.settings.throttlingDelay,
  );

  onMouseClick(event: BaseMapPointerEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event)) {
      return { next: true };
    }
    const lngLat: LngLatTuple = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();

    if (this.circleCenterPoint && this.circleCenterLngLat) {
      this.fireBeforeFeatureCreate({
        geoJsonFeatures: [this.getCircleGeoJson(this.circleCenterLngLat, lngLat)],
      });

      if (this.flags.featureCreateAllowed) {
        this.saveCircleFeature(lngLat);
        this.circleCenterLngLat = null;
        this.circleCenterPoint = null;
        this.fireFinishEvent();
      }
    } else {
      this.gm.features.clearSelection();
      this.fireBeforeFeatureCreate({ geoJsonFeatures: [this.getFeatureGeoJson(lngLat)] });

      if (this.flags.featureCreateAllowed) {
        this.circleCenterLngLat = lngLat;
        this.circleCenterPoint = this.gm.mapAdapter.project(this.circleCenterLngLat);
        this.featureData = this.createFeature();

        const markerData = this.getControlMarkerData();
        if (this.featureData && markerData) {
          this.fireStartEvent(this.featureData, markerData);
        }
      }
    }
    return { next: false };
  }

  onMouseMove(): MapHandlerReturnData {
    if (this.circleCenterLngLat && this.gm.markerPointer.marker) {
      const markerLngLat = this.gm.markerPointer.marker.getLngLat();
      this.fireBeforeFeatureCreate({
        geoJsonFeatures: [this.getCircleGeoJson(this.circleCenterLngLat, markerLngLat)],
      });

      if (this.flags.featureCreateAllowed) {
        this.throttledMethods.updateFeatureGeoJson(markerLngLat);
      }
    }

    if (!this.circleCenterPoint) {
      this.fireMarkerPointerUpdateEvent();
    }

    return { next: false };
  }

  updateFeatureGeoJson(rimLngLat: LngLatTuple) {
    if (this.featureData && this.circleCenterLngLat) {
      const featureGeoJson = this.getCircleGeoJson(this.circleCenterLngLat, rimLngLat);
      this.featureData.updateGeoJsonGeometry(featureGeoJson.geometry);

      const markerData = this.getControlMarkerData();
      if (markerData) {
        this.fireUpdateEvent(this.featureData, markerData);
      }
    }
  }

  saveCircleFeature(eventLngLat: LngLatTuple) {
    // it's needed to have a custom logic for saving a circle
    // for now circle is converted to a geojson polygon,

    if (!this.circleCenterLngLat) {
      return;
    }

    if (this.featureData) {
      const lngLat = this.gm.markerPointer.marker?.getLngLat() || eventLngLat;
      this.updateFeatureGeoJson(lngLat);
      this.featureData.setShapeProperty('center', this.circleCenterLngLat);

      if (this.isFeatureGeoJsonValid()) {
        this.saveFeature();
      } else {
        this.removeTmpFeature();
      }
    }
  }

  isFeatureGeoJsonValid(): boolean {
    if (!this.featureData) {
      return false;
    }

    // for now only checks if all points aren't the same
    return allCoordinatesEqual(this.featureData.getGeoJson());
  }

  getCircleGeoJson(center: LngLatTuple, endLngLat: LngLatTuple) {
    const radius = this.gm.mapAdapter.getDistance(center, endLngLat);
    const circleGeoJson = getGeoJsonCircle({ center, radius });

    return {
      ...circleGeoJson,
      properties: {
        shape: this.shape,
      },
    };
  }
}
