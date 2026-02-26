import type { DrawModeName, LngLatTuple, ShapeName } from '@/main.ts';
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

  async onEndAction() {
    await this.fireMarkerPointerFinishEvent();
    await super.onEndAction();
  }

  async onMouseMove() {
    await this.fireMarkerPointerUpdateEvent();
    return { next: true };
  }

  async onMouseClick(event: BaseMapPointerEvent) {
    const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();
    await this.fireBeforeFeatureCreate({ geoJsonFeatures: [this.getFeatureGeoJson(lngLat)] });

    if (this.flags.featureCreateAllowed) {
      this.featureData = await this.createFeature();
      this.circleCenterLngLat = lngLat;
      this.circleCenterPoint = this.gm.mapAdapter.project(this.circleCenterLngLat);
      await this.updateFeaturePosition(this.circleCenterLngLat);
      await this.saveFeature();
    }
    return { next: false };
  }

  async updateFeaturePosition(lngLat: LngLatTuple) {
    if (!this.featureData) {
      return;
    }

    const shapeGeoJson = this.getFeatureGeoJson(lngLat);
    await this.featureData.updateGeometry(shapeGeoJson.geometry);
  }
}
