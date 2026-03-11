import circleMarker from '@/assets/images/controls/circle-marker.svg';
import { FeatureData } from '@/core/features/feature-data.ts';
import type { MapHandlerReturnData } from '@/types/events/bus.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLatTuple, ScreenPoint } from '@/types/map/index.ts';
import type { DrawModeName, MarkerData, ShapeName } from '@/types/modes/index.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { FEATURE_PROPERTY_PREFIX, SOURCES } from '@/core/features/constants.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';

export abstract class BaseCircle extends BaseDraw {
  mode: DrawModeName = 'circle';
  shape: ShapeName = 'circle';
  eventHandlers = {
    mousemove: this.onMouseMove.bind(this),
    click: this.onMouseClick.bind(this),
  };
  protected circleCenterPoint: ScreenPoint | null = null;
  protected circleCenterLngLat: LngLatTuple | null = null;

  onStartAction() {
    this.gm.markerPointer.enable();
  }

  async onEndAction() {
    await this.removeTmpFeature();
    this.gm.markerPointer.disable();
    await this.fireFinishEvent();
  }

  abstract onMouseMove(event: BaseMapEvent): Promise<MapHandlerReturnData> | MapHandlerReturnData;

  abstract onMouseClick(event: BaseMapEvent): Promise<MapHandlerReturnData> | MapHandlerReturnData;

  getFeatureGeoJson(position: LngLatTuple): GeoJsonShapeFeature {
    return {
      type: 'Feature',
      properties: {
        [`${FEATURE_PROPERTY_PREFIX}shape`]: this.shape,
        [`${FEATURE_PROPERTY_PREFIX}center`]: position,
      },
      geometry: {
        type: 'Point',
        coordinates: position,
      },
    };
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

  protected async createFeature(): Promise<FeatureData | null> {
    const featureData = await this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson(this.circleCenterLngLat || [0, 0]),
      sourceName: SOURCES.temporary,
    });

    if (featureData && this.circleCenterLngLat) {
      await featureData.setShapeProperty('center', this.circleCenterLngLat);
    }
    return featureData;
  }

  protected createMarker() {
    const element = document.createElement('div');
    element.innerHTML = circleMarker;
    const svgElement = element.firstChild as HTMLElement;
    svgElement.style.color = '#278cda';
    svgElement.style.width = '28px';
    svgElement.style.height = '28px';
    svgElement.style.pointerEvents = 'none';

    return this.gm.mapAdapter.createDomMarker(
      {
        draggable: false,
        anchor: 'center',
        element: svgElement,
      },
      [0, 0],
    );
  }
}
