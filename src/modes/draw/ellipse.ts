import type { DrawModeName, LngLatTuple, ScreenPoint, ShapeName } from '@/types';
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import { BaseCircle } from './base-circle.ts';
import { convertToThrottled, isMapPointerEvent } from '@/main.ts';
import { allCoordinatesEqual, getEllipseParameters, getGeoJsonEllipse } from '@/utils/geojson.ts';

export class DrawEllipse extends BaseCircle {
  mode: DrawModeName = 'ellipse';
  shape: ShapeName = 'ellipse';

  protected xSemiAxisPoint: ScreenPoint | null = null;
  protected xSemiAxisLngLat: LngLatTuple | null = null;

  throttledMethods = convertToThrottled(
    {
      updateFeatureGeoJson: this.updateFeatureGeoJson,
    },
    this,
    this.gm.options.settings.throttlingDelay,
  );

  async onMouseClick(event: BaseMapEvent) {
    if (!isMapPointerEvent(event)) {
      return { next: true };
    }
    const lngLat: LngLatTuple = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();

    if (this.circleCenterLngLat && this.xSemiAxisLngLat) {
      await this.fireBeforeFeatureCreate({
        geoJsonFeatures: [
          this.getEllipseGeoJson(this.circleCenterLngLat, this.xSemiAxisLngLat, lngLat),
        ],
      });

      if (this.flags.featureCreateAllowed) {
        await this.saveEllipseFeature(lngLat);
        this.circleCenterLngLat = null;
        this.circleCenterPoint = null;
        this.xSemiAxisPoint = null;
        this.xSemiAxisLngLat = null;
        await this.fireFinishEvent();
      }
    } else if (this.circleCenterLngLat) {
      await this.fireBeforeFeatureCreate({
        geoJsonFeatures: [this.getEllipseGeoJson(this.circleCenterLngLat, lngLat)],
      });

      if (this.flags.featureCreateAllowed) {
        this.xSemiAxisLngLat = lngLat;
        this.xSemiAxisPoint = this.gm.mapAdapter.project(this.circleCenterLngLat);
      }
    } else {
      await this.fireBeforeFeatureCreate({ geoJsonFeatures: [this.getFeatureGeoJson(lngLat)] });

      if (this.flags.featureCreateAllowed) {
        this.circleCenterLngLat = lngLat;
        this.circleCenterPoint = this.gm.mapAdapter.project(this.circleCenterLngLat);
        this.featureData = await this.createFeature();

        const markerData = this.getControlMarkerData();
        if (this.featureData && markerData) {
          await this.fireStartEvent(this.featureData, markerData);
        }
      }
    }

    return { next: false };
  }

  async onMouseMove() {
    if (this.circleCenterLngLat && this.gm.markerPointer.marker) {
      const markerLngLat = this.gm.markerPointer.marker.getLngLat();

      await this.fireBeforeFeatureCreate({
        geoJsonFeatures: [
          this.xSemiAxisLngLat
            ? this.getEllipseGeoJson(this.circleCenterLngLat, this.xSemiAxisLngLat, markerLngLat)
            : this.getEllipseGeoJson(this.circleCenterLngLat, markerLngLat),
        ],
      });

      if (this.flags.featureCreateAllowed) {
        await this.throttledMethods.updateFeatureGeoJson(markerLngLat);
      }
    }

    if (!this.circleCenterLngLat) {
      await this.fireMarkerPointerUpdateEvent();
    }

    return { next: false };
  }

  async updateFeatureGeoJson(eventLngLat: LngLatTuple) {
    if (!this.featureData || !this.circleCenterLngLat) {
      return;
    }

    const featureGeoJson = this.xSemiAxisLngLat
      ? this.getEllipseGeoJson(this.circleCenterLngLat, this.xSemiAxisLngLat, eventLngLat)
      : this.getEllipseGeoJson(this.circleCenterLngLat, eventLngLat);
    await this.featureData.updateGeometry(featureGeoJson.geometry);

    await this.featureData._updateAllProperties({
      __gm_shape: featureGeoJson.properties.__gm_shape,
    });

    const markerData = this.getControlMarkerData();
    if (markerData) {
      await this.fireUpdateEvent(this.featureData, markerData);
    }
  }

  async saveEllipseFeature(eventLngLat: LngLatTuple) {
    if (!this.circleCenterLngLat || !this.xSemiAxisLngLat) {
      return;
    }

    if (this.featureData) {
      const lngLat = this.gm.markerPointer.marker?.getLngLat() || eventLngLat;
      await this.updateFeatureGeoJson(lngLat);

      const { xSemiAxis, ySemiAxis, angle } = getEllipseParameters({
        center: this.circleCenterLngLat,
        xSemiAxisLngLat: this.xSemiAxisLngLat,
        rimLngLat: lngLat,
      });

      await this.featureData.setShapeProperty('center', this.circleCenterLngLat);
      await this.featureData.setShapeProperty('xSemiAxis', xSemiAxis);
      await this.featureData.setShapeProperty('ySemiAxis', ySemiAxis);
      await this.featureData.setShapeProperty('angle', angle);

      if (this.isFeatureGeoJsonValid()) {
        await this.saveFeature();
      } else {
        await this.removeTmpFeature();
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

  getEllipseGeoJson(center: LngLatTuple, xSemiAxisLngLat: LngLatTuple, rimLngLat?: LngLatTuple) {
    const { xSemiAxis, ySemiAxis, angle } = getEllipseParameters({
      center,
      xSemiAxisLngLat,
      rimLngLat,
    });

    return getGeoJsonEllipse({ center, xSemiAxis, ySemiAxis, angle });
  }
}
