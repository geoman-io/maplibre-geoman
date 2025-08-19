import circleMarker from '@/assets/images/controls/circle-marker.svg';
import { FeatureData } from '@/core/features/feature-data.ts';
import { SOURCES } from '@/core/features/index.ts';
import type {
  AnyEvent,
  DrawModeName,
  GeoJsonShapeFeature,
  LngLat,
  MapHandlerReturnData,
  MarkerData,
  ScreenPoint,
  ShapeName,
} from '@/main.ts';

import { BaseDraw } from '@/modes/draw/base.ts';


export abstract class BaseCircle extends BaseDraw {
  mode: DrawModeName = 'circle';
  shape: ShapeName = 'circle';
  protected circleCenterPoint: ScreenPoint | null = null;
  protected circleCenterLngLat: LngLat | null = null;
  eventHandlers = {
    mousemove: this.onMouseMove.bind(this),
    click: this.onMouseClick.bind(this),
  };

  onStartAction() {
    this.gm.markerPointer.enable();
  }

  onEndAction() {
    this.removeTmpFeature();
    this.gm.markerPointer.disable();
    this.fireFinishEvent();
  }

  abstract onMouseMove(event: AnyEvent): MapHandlerReturnData;

  abstract onMouseClick(event: AnyEvent): MapHandlerReturnData;

  protected createFeature(): FeatureData | null {
    const featureData = this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson(this.circleCenterLngLat || [0, 0]),
      sourceName: SOURCES.temporary,
    });

    if (featureData && this.circleCenterLngLat) {
      featureData.setShapeProperty('center', this.circleCenterLngLat);
    }
    return featureData;
  }

  getFeatureGeoJson(position: LngLat): GeoJsonShapeFeature {
    return {
      type: 'Feature',
      properties: {
        shape: this.shape,
      },
      geometry: {
        type: 'Point',
        coordinates: position,
      },
    };
  }

  protected createMarker() {
    const element = document.createElement('div');
    element.innerHTML = circleMarker;
    const svgElement = element.firstChild as HTMLElement;
    svgElement.style.color = '#278cda';
    svgElement.style.width = '28px';
    svgElement.style.height = '28px';
    svgElement.style.pointerEvents = 'none';

    return this.gm.mapAdapter.createDomMarker({
      draggable: false,
      anchor: 'center',
      element: svgElement,
    }, [0, 0]);
  }

  getControlMarkerData(): MarkerData | null {
    const marker = this.gm.markerPointer.marker;
    if (!marker) {
      return null;
    }

    return {
      type: 'dom',
      instance: marker,
      position: {
        coordinate: marker.getLngLat(),
        path: [-1],
      },
    };
  }
}
