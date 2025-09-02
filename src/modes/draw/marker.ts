import defaultMarker from '@/assets/images/markers/default-marker.png';
import { FeatureData } from '@/core/features/feature-data.ts';
import {
  type AnyEvent,
  type DrawModeName,
  type GeoJsonShapeFeature,
  type GMEvent,
  type LngLat,
  type MapHandlerReturnData,
  type MapPointerEvent,
  type ShapeName,
  SOURCES,
} from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';

export class DrawMarker extends BaseDraw {
  mode: DrawModeName = 'marker';
  shape: ShapeName = 'marker';
  eventHandlers = {
    click: this.onMouseClick.bind(this),
    mousemove: this.onMouseMove.bind(this),
  };

  onStartAction() {
    const customMarker = this.createMarker();
    this.gm.markerPointer.enable({ customMarker });
    this.fireMarkerPointerStartEvent();
  }

  onEndAction() {
    this.gm.markerPointer.disable();
    this.fireMarkerPointerFinishEvent();
  }

  onMouseClick(event: AnyEvent): MapHandlerReturnData {
    if (isMapPointerEvent(event)) {
      this.featureData = this.createFeature(event);
      if (this.featureData) {
        this.saveFeature();
      }
    }
    return { next: false };
  }

  onMouseMove(event: GMEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event) || !this.gm.markerPointer.marker) {
      return { next: true };
    }
    this.fireMarkerPointerUpdateEvent();
    return { next: true };
  }

  createFeature(event: MapPointerEvent): FeatureData | null {
    const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();
    const geoJson = this.getFeatureGeoJson(lngLat);

    if (geoJson) {
      this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

      if (this.flags.featureCreateAllowed) {
        return this.gm.features.createFeature({
          shapeGeoJson: geoJson,
          sourceName: SOURCES.temporary,
        });
      }
    }
    return null;
  }

  getFeatureGeoJson(lngLat: LngLat): GeoJsonShapeFeature | null {
    return {
      type: 'Feature',
      properties: {
        shape: this.shape,
      },
      geometry: {
        type: 'Point',
        coordinates: lngLat,
      },
    };
  }

  protected createMarker() {
    const iconElement = document.createElement('div');
    iconElement.style.backgroundImage = `url("${defaultMarker}")`;
    iconElement.style.width = '36px';
    iconElement.style.height = '36px';
    iconElement.style.backgroundSize = 'cover';
    iconElement.style.pointerEvents = 'none';

    return this.gm.mapAdapter.createDomMarker(
      {
        draggable: false,
        anchor: 'bottom',
        element: iconElement,
      },
      [0, 0],
    );
  }
}
