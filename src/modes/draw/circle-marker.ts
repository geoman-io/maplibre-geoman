import type { DrawModeName, LngLatTuple, MapHandlerReturnData, ShapeName } from '@/main.ts';
import { BaseCircle } from '@/modes/draw/base-circle.ts';
import type { BaseMapPointerEvent } from '@mapLib/types/events.ts';

export class DrawCircleMarker extends BaseCircle {
  mode: DrawModeName = 'circle_marker';
  shape: ShapeName = 'circle_marker';

  onStartAction() {
    this.gm.markerPointer.enable({
      customMarker: this.createMarker(),
    });
  }

  onEndAction() {
    this.fireMarkerPointerFinishEvent();
    super.onEndAction();
  }

  onMouseMove(): MapHandlerReturnData {
    this.fireMarkerPointerUpdateEvent();
    return { next: true };
  }

  onMouseClick(event: BaseMapPointerEvent): MapHandlerReturnData {
    this.gm.features.clearSelection();
    const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();
    this.fireBeforeFeatureCreate({ geoJsonFeatures: [this.getFeatureGeoJson(lngLat)] });

    if (this.flags.featureCreateAllowed) {
      this.featureData = this.createFeature();
      this.circleCenterLngLat = lngLat;
      this.circleCenterPoint = this.gm.mapAdapter.project(this.circleCenterLngLat);
      this.updateFeaturePosition(this.circleCenterLngLat);
      this.saveFeature();
    }
    return { next: false };
  }

  updateFeaturePosition(lngLat: LngLatTuple) {
    if (!this.featureData) {
      return;
    }

    const shapeGeoJson = this.getFeatureGeoJson(lngLat);
    this.featureData.updateGeoJsonGeometry(shapeGeoJson.geometry);
  }
}
