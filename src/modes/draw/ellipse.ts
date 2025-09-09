import type {
  AnyEvent,
  DrawModeName,
  LngLat,
  MapHandlerReturnData,
  ScreenPoint,
  ShapeName,
} from '@/types';
import { BaseCircle } from './base-circle.ts';
import { convertToThrottled, isMapPointerEvent } from '@/main.ts';
import { allCoordinatesEqual, getEllipseParameters, getGeoJsonEllipse } from '@/utils/geojson.ts';

export class DrawEllipse extends BaseCircle {
  mode: DrawModeName = 'ellipse';
  shape: ShapeName = 'ellipse';

  protected xSemiAxisPoint: ScreenPoint | null = null;
  protected xSemiAxisLngLat: LngLat | null = null;

  throttledMethods = convertToThrottled(
    {
      updateFeatureGeoJson: this.updateFeatureGeoJson,
    },
    this,
    this.gm.options.settings.throttlingDelay,
  );

  onMouseClick(event: AnyEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event)) {
      return { next: true };
    }
    const lngLat: LngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();

    if (this.circleCenterLngLat && this.xSemiAxisLngLat) {
      this.fireBeforeFeatureCreate({
        geoJsonFeatures: [
          this.getEllipseGeoJson(this.circleCenterLngLat, this.xSemiAxisLngLat, lngLat),
        ],
      });

      if (this.flags.featureCreateAllowed) {
        this.saveEllipseFeature(lngLat);
        this.circleCenterLngLat = null;
        this.circleCenterPoint = null;
        this.xSemiAxisPoint = null;
        this.xSemiAxisLngLat = null;
        this.fireFinishEvent();
      }
    } else if (this.circleCenterLngLat) {
      this.fireBeforeFeatureCreate({
        geoJsonFeatures: [this.getEllipseGeoJson(this.circleCenterLngLat, lngLat)],
      });

      if (this.flags.featureCreateAllowed) {
        this.xSemiAxisLngLat = lngLat;
        this.xSemiAxisPoint = this.gm.mapAdapter.project(this.circleCenterLngLat);
      }
    } else {
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
        geoJsonFeatures: [
          this.xSemiAxisLngLat
            ? this.getEllipseGeoJson(this.circleCenterLngLat, this.xSemiAxisLngLat, markerLngLat)
            : this.getEllipseGeoJson(this.circleCenterLngLat, markerLngLat),
        ],
      });

      if (this.flags.featureCreateAllowed) {
        this.throttledMethods.updateFeatureGeoJson(markerLngLat);
      }
    }

    if (!this.circleCenterLngLat) {
      this.fireMarkerPointerUpdateEvent();
    }

    return { next: false };
  }

  updateFeatureGeoJson(eventLngLat: LngLat) {
    if (!this.featureData || !this.circleCenterLngLat) {
      return;
    }

    const featureGeoJson = this.xSemiAxisLngLat
      ? this.getEllipseGeoJson(this.circleCenterLngLat, this.xSemiAxisLngLat, eventLngLat)
      : this.getEllipseGeoJson(this.circleCenterLngLat, eventLngLat);
    this.featureData.updateGeoJsonGeometry(featureGeoJson.geometry);

    this.featureData.updateGeoJsonProperties({
      shape: featureGeoJson.properties.shape,
    });

    const markerData = this.getControlMarkerData();
    if (markerData) {
      this.fireUpdateEvent(this.featureData, markerData);
    }
  }

  saveEllipseFeature(eventLngLat: LngLat) {
    if (!this.circleCenterLngLat || !this.xSemiAxisLngLat) {
      return;
    }

    if (this.featureData) {
      const lngLat = this.gm.markerPointer.marker?.getLngLat() || eventLngLat;
      this.updateFeatureGeoJson(lngLat);

      const { xSemiAxis, ySemiAxis, angle } = getEllipseParameters({
        center: this.circleCenterLngLat,
        xSemiAxisLngLat: this.xSemiAxisLngLat,
        rimLngLat: lngLat,
      });

      this.featureData.setShapeProperty('center', this.circleCenterLngLat);
      this.featureData.setShapeProperty('xSemiAxis', xSemiAxis);
      this.featureData.setShapeProperty('ySemiAxis', ySemiAxis);
      this.featureData.setShapeProperty('angle', angle);

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

  getEllipseGeoJson(center: LngLat, xSemiAxisLngLat: LngLat, rimLngLat?: LngLat) {
    const { xSemiAxis, ySemiAxis, angle } = getEllipseParameters({
      center,
      xSemiAxisLngLat,
      rimLngLat,
    });

    return getGeoJsonEllipse({ center, xSemiAxis, ySemiAxis, angle });
  }
}
