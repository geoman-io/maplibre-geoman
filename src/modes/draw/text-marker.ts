import {
  type DrawModeName,
  FEATURE_PROPERTY_PREFIX,
  type GeoJsonShapeFeature,
  type LngLatTuple,
  type ScreenPoint,
  type ShapeName,
} from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';

import { SOURCES } from '@/core/features/constants.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';

export class DrawTextMarker extends BaseDraw {
  mode: DrawModeName = 'text_marker';
  shape: ShapeName = 'text_marker';
  textarea: HTMLTextAreaElement | null = null;
  eventHandlers = {
    click: this.onMouseClick.bind(this),
    mousemove: this.onMouseMove.bind(this),
  };

  onStartAction() {
    this.gm.markerPointer.enable({ invisibleMarker: true });
  }

  async onEndAction() {
    this.removeTextarea();
    await this.removeTmpFeature();
    this.featureData = null;
    this.gm.markerPointer.disable();
    await this.fireMarkerPointerFinishEvent();
  }

  async onMouseMove(event: BaseMapEvent) {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }

    await this.fireMarkerPointerUpdateEvent();
    return { next: true };
  }

  async onMouseClick(event: BaseMapEvent) {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }

    if (this.textarea) {
      await this.endShape();
      this.gm.markerPointer.enable({ invisibleMarker: true, lngLat: event.lngLat.toArray() });
      await this.fireMarkerPointerUpdateEvent();
    } else {
      const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();
      await this.fireBeforeFeatureCreate({ geoJsonFeatures: [this.getFeatureGeoJson(lngLat)] });

      if (this.flags.featureCreateAllowed) {
        this.featureData = await this.createFeature(lngLat);
        this.gm.markerPointer.disable();
        await this.fireMarkerPointerFinishEvent();
      }
    }
    return { next: false };
  }

  createFeature(lngLat: LngLatTuple) {
    const point = this.gm.mapAdapter.project(lngLat);
    this.createTextarea(point);
    return this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson(lngLat),
      sourceName: SOURCES.temporary,
    });
  }

  async endShape() {
    const text = this.textarea?.value || '';
    this.removeTextarea();

    if (text.trim()) {
      await this.updateFeatureSource(text);
      await this.saveFeature();
    } else {
      await this.removeTmpFeature();
    }
  }

  createTextarea(point: ScreenPoint) {
    this.textarea = document.createElement('textarea');
    this.textarea.style.position = 'absolute';
    this.textarea.style.left = `${point[0]}px`;
    this.textarea.style.top = `${point[1]}px`;
    this.textarea.style.opacity = '0.7';
    this.gm.mapAdapter.getContainer().appendChild(this.textarea);
    this.textarea.focus();
  }

  removeTextarea() {
    this.textarea?.remove();
    this.textarea = null;
  }

  getFeatureGeoJson(lngLat: LngLatTuple): GeoJsonShapeFeature {
    return {
      type: 'Feature',
      properties: {
        shape: this.shape,
        text: '',
      },
      geometry: {
        type: 'Point',
        coordinates: lngLat,
      },
    };
  }

  async updateFeatureSource(text: string) {
    if (!this.featureData) {
      return;
    }
    await this.featureData._updateAllProperties({
      [`${FEATURE_PROPERTY_PREFIX}shape`]: this.shape,
      [`${FEATURE_PROPERTY_PREFIX}text`]: text,
    });
  }
}
