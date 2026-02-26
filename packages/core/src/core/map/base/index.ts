import GmControl from '@/core/controls/index.ts';
import type { FeatureData } from '@/core/features/feature-data.ts';
import type { BaseLayer } from '@/core/map/base/layer.ts';
import type { BaseDomMarker } from '@/core/map/base/marker.ts';
import type { BasePopup } from '@/core/map/base/popup.ts';
import type { BaseSource } from '@/core/map/base/source.ts';
import type {
  AnyEventName,
  BaseDomMarkerOptions,
  BaseEventListener,
  BaseFitBoundsOptions,
  BasePopupOptions,
  CursorType,
  FeatureSourceName,
  GeoJsonFeatureData,
  LineBasedGeometry,
  LngLatTuple,
  MapEventName,
  MapInstanceWithGeoman,
  MapInteraction,
  MapTypes,
  ScreenPoint,
} from '@/main.ts';
import {
  eachSegmentWithPath,
  getEuclideanDistance,
  getEuclideanSegmentNearestPoint,
} from '@/utils/geojson.ts';
import turfDistance from '@turf/distance';
import type { Feature, FeatureCollection, GeoJSON } from 'geojson';

export abstract class BaseMapAdapter<
  TMapInstance = MapInstanceWithGeoman,
  TSource = unknown,
  TLayer = unknown,
> {
  abstract mapType: keyof MapTypes;

  abstract mapInstance: TMapInstance;

  abstract getMapInstance(): TMapInstance;

  abstract isLoaded(): boolean;

  abstract getContainer(): HTMLElement;

  abstract getCanvas(): HTMLCanvasElement;

  abstract addControl(control: GmControl): void;

  abstract removeControl(control: GmControl): void;

  abstract loadImage({ id, image }: { id: string; image: string }): Promise<void>;

  abstract removeImage(id: string): void;

  abstract getBounds(): [LngLatTuple, LngLatTuple];

  abstract fitBounds(bounds: [LngLatTuple, LngLatTuple], options?: BaseFitBoundsOptions): void;

  abstract setCursor(cursor: CursorType): void;

  abstract disableMapInteractions(interactionTypes: Array<MapInteraction>): void;

  abstract enableMapInteractions(interactionTypes: Array<MapInteraction>): void;

  abstract setDragPan(value: boolean): void;

  abstract queryFeaturesByScreenCoordinates({
    queryCoordinates,
    sourceNames,
  }: {
    queryCoordinates: ScreenPoint | [ScreenPoint, ScreenPoint];
    sourceNames: Array<FeatureSourceName>;
  }): Array<FeatureData>;

  abstract queryGeoJsonFeatures({
    queryCoordinates,
    sourceNames,
  }: {
    queryCoordinates?: ScreenPoint | [ScreenPoint, ScreenPoint];
    sourceNames: Array<FeatureSourceName>;
  }): Array<GeoJsonFeatureData>;

  abstract addSource(sourceId: string, geoJson: GeoJSON): BaseSource<TSource>;

  abstract getSource(sourceId: string): BaseSource<TSource>;

  // abstract removeSource(sourceId: string): void;

  abstract addLayer(options: unknown): BaseLayer<TLayer>;

  abstract getLayer(layerId: string): BaseLayer<TLayer> | null;

  abstract removeLayer(layerId: string): void;

  abstract eachLayer(callback: (layer: BaseLayer<TLayer>) => void): void;

  abstract createDomMarker(options: BaseDomMarkerOptions, lngLat: LngLatTuple): BaseDomMarker;

  abstract createPopup(options: BasePopupOptions): BasePopup;

  abstract project(position: LngLatTuple): ScreenPoint;

  abstract unproject(point: ScreenPoint): LngLatTuple;

  abstract coordBoundsToScreenBounds(
    bounds: [LngLatTuple, LngLatTuple],
  ): [ScreenPoint, ScreenPoint];

  getEuclideanNearestLngLat(
    shapeGeoJson: Feature<LineBasedGeometry> | FeatureCollection<LineBasedGeometry>,
    lngLat: LngLatTuple,
  ): LngLatTuple {
    const targetPoint = this.project(lngLat);
    let closestPoint: ScreenPoint = [0, 0];
    let minDistance = Infinity;

    eachSegmentWithPath(shapeGeoJson, (segment) => {
      const linePoint1 = this.project(segment.start.coordinate);
      const linePoint2 = this.project(segment.end.coordinate);
      const nearestCoordinates = getEuclideanSegmentNearestPoint(
        linePoint1,
        linePoint2,
        targetPoint,
      );
      const distance = getEuclideanDistance(targetPoint, nearestCoordinates);

      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = [nearestCoordinates[0], nearestCoordinates[1]];
      }
    });

    return this.unproject(closestPoint);
  }

  abstract fire(type: AnyEventName, data?: unknown): void;

  abstract on<T extends AnyEventName>(type: T, listener: BaseEventListener<T>): void;
  abstract on(type: MapEventName, layerId: string, listener: BaseEventListener): void;

  abstract once<T extends AnyEventName>(type: AnyEventName, listener: BaseEventListener<T>): void;
  abstract once(type: MapEventName, layerId: string, listener: BaseEventListener): void;

  abstract off<T extends AnyEventName>(type: AnyEventName, listener: BaseEventListener<T>): void;
  abstract off(type: MapEventName, layerId: string, listener: BaseEventListener): void;

  getDistance(lngLat1: LngLatTuple, lngLat2: LngLatTuple): number {
    return turfDistance(lngLat1, lngLat2, { units: 'meters' });
  }
}
