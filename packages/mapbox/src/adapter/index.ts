import GmControl from '@/core/controls/index.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import { BaseMapAdapter } from '@/core/map/base/index.ts';
import type { BaseLayer } from '@/core/map/base/layer.ts';
import { BaseDomMarker } from '@/core/map/base/marker.ts';
import type { BasePopup } from '@/core/map/base/popup.ts';
import { MapboxLayer } from './layer.ts';
import { MapboxDomMarker } from './marker.ts';
import { MapboxPopup } from './popup.ts';
import { MapboxSource } from './source.ts';
import {
  type BaseDomMarkerOptions,
  type BaseEventListener,
  type BaseFitBoundsOptions,
  type BaseMapName,
  type BasePopupOptions,
  type CursorType,
  FEATURE_ID_PROPERTY,
  type FeatureId,
  type FeatureSourceName,
  type GeoJsonFeatureData,
  type GeoJsonImportFeature,
  type Geoman,
  type LngLatTuple,
  type MapInteraction,
  type ScreenPoint,
} from '@/main.ts';
import type { MapboxAnyLayer } from '@mapLib/types/layers.ts';
import type { GeoJSON } from 'geojson';
import { isEqual, uniqWith } from 'lodash-es';
import mapboxgl from 'mapbox-gl';
import { isMapboxSupportedPointerEventName } from './guards.ts';

type MapboxAddLayerObject = Parameters<mapboxgl.Map['addLayer']>[0];

export class MapboxAdapter extends BaseMapAdapter<
  mapboxgl.Map,
  mapboxgl.GeoJSONSource,
  MapboxAnyLayer
> {
  mapType: BaseMapName = 'mapbox';

  constructor(map: unknown, gm: Geoman) {
    super(map as mapboxgl.Map, gm);
  }

  isLoaded(): boolean {
    // Prefer public APIs and only fall back to private internals.
    const map = this.mapInstance as mapboxgl.Map & {
      _loaded?: boolean;
      isStyleLoaded?: () => boolean;
    };

    if (typeof map.loaded === 'function' && map.loaded()) {
      return true;
    }
    if (typeof map.isStyleLoaded === 'function' && map.isStyleLoaded()) {
      return true;
    }
    return map._loaded === true;
  }

  getContainer(): HTMLElement {
    return this.mapInstance.getContainer();
  }

  getCanvas(): HTMLCanvasElement {
    return this.mapInstance.getCanvas();
  }

  addControl(control: GmControl) {
    this.mapInstance.addControl(control);
  }

  removeControl(control: GmControl) {
    this.mapInstance.removeControl(control);
  }

  async loadImage({ id, image }: { id: string; image: string }) {
    if (!this.mapInstance.hasImage(id)) {
      // Mapbox GL JS uses a callback-based loadImage API
      const loadedImage = await new Promise<ImageBitmap | HTMLImageElement | ImageData>(
        (resolve, reject) => {
          this.mapInstance.loadImage(image, (error, result) => {
            if (error) reject(error);
            else if (result) resolve(result);
            else reject(new Error('loadImage returned no result'));
          });
        },
      );
      this.mapInstance.addImage(id, loadedImage);
    }
  }

  removeImage(id: string) {
    try {
      if (this.mapInstance.hasImage(id)) {
        this.mapInstance.removeImage(id);
      }
    } catch {
      // Map may have been destroyed, style is no longer available
    }
  }

  getBounds(): [LngLatTuple, LngLatTuple] {
    const mapBounds = this.mapInstance.getBounds()!;
    return mapBounds.toArray() as [LngLatTuple, LngLatTuple];
  }

  fitBounds(bounds: [LngLatTuple, LngLatTuple], options?: BaseFitBoundsOptions) {
    this.mapInstance.fitBounds(bounds, options);
  }

  setCursor(cursor: CursorType) {
    this.mapInstance.getCanvas().style.cursor = cursor;
  }

  disableMapInteractions(interactionTypes: Array<MapInteraction>): void {
    interactionTypes.forEach((interactionType) => {
      this.mapInstance[interactionType].disable();
    });
  }

  enableMapInteractions(interactionTypes: Array<MapInteraction>): void {
    interactionTypes.forEach((interactionType) => {
      this.mapInstance[interactionType].enable();
    });
  }

  setDragPan(value: boolean) {
    if (value) {
      this.mapInstance.dragPan.enable();
    } else {
      this.mapInstance.dragPan.disable();
    }
  }

  private queryRendered(queryCoordinates?: ScreenPoint | [ScreenPoint, ScreenPoint]) {
    if (queryCoordinates) {
      return this.mapInstance.queryRenderedFeatures(queryCoordinates);
    }
    return this.mapInstance.queryRenderedFeatures();
  }

  queryFeaturesByScreenCoordinates({
    queryCoordinates = undefined,
    sourceNames,
  }: {
    queryCoordinates?: ScreenPoint | [ScreenPoint, ScreenPoint];
    sourceNames: Array<FeatureSourceName>;
  }): Array<FeatureData> {
    const features = uniqWith(
      this.queryRendered(queryCoordinates).map((feature) => ({
        featureId: (feature.properties ?? {})[FEATURE_ID_PROPERTY] as FeatureId | undefined,
        featureSourceName: feature.source as FeatureSourceName,
      })),
      isEqual,
    );

    return features
      .map(({ featureId, featureSourceName }) => {
        if (featureId === undefined || !sourceNames.includes(featureSourceName)) {
          return null;
        }

        return this.gm.features.get(featureSourceName, featureId) || null;
      })
      .filter((featureData): featureData is FeatureData => !!featureData);
  }

  queryGeoJsonFeatures({
    queryCoordinates = undefined,
    sourceNames,
  }: {
    queryCoordinates?: ScreenPoint | [ScreenPoint, ScreenPoint];
    sourceNames: Array<FeatureSourceName>;
  }) {
    const comparator = (
      item1: GeoJsonFeatureData | null,
      item2: GeoJsonFeatureData | null,
    ): boolean => {
      return item1?.id === item2?.id;
    };

    const features: Array<GeoJsonFeatureData | null> = uniqWith(
      this.queryRendered(queryCoordinates).map((feature) => {
        const geoJson = this.convertToGeoJsonImportFeature(feature);
        if (!geoJson) {
          return null;
        }
        return {
          id: (feature.properties ?? {})[FEATURE_ID_PROPERTY] as FeatureId | undefined,
          sourceName: feature.source as FeatureSourceName,
          geoJson,
        };
      }),
      comparator,
    );

    return features.filter((item: GeoJsonFeatureData | null): item is GeoJsonFeatureData => {
      return (
        !!item && item.id !== undefined && item.geoJson && sourceNames.includes(item.sourceName)
      );
    });
  }

  convertToGeoJsonImportFeature(feature: mapboxgl.GeoJSONFeature): GeoJsonImportFeature | null {
    const featureId = (feature.properties ?? {})[FEATURE_ID_PROPERTY] as FeatureId | undefined;
    if (featureId === undefined || feature.geometry.type === 'GeometryCollection') {
      return null;
    }

    return {
      id: featureId,
      type: 'Feature',
      properties: feature.properties ?? {},
      geometry: feature.geometry,
    };
  }

  addSource(sourceId: string, geoJson: GeoJSON): MapboxSource {
    return new MapboxSource({ gm: this.gm, sourceId, geoJson });
  }

  getSource(sourceId: string): MapboxSource {
    return new MapboxSource({ gm: this.gm, sourceId });
  }

  addLayer(options: MapboxAddLayerObject): MapboxLayer {
    const layerId = options.id;
    return new MapboxLayer({ gm: this.gm, layerId, options });
  }

  getLayer(layerId: string): BaseLayer<MapboxAnyLayer> | null {
    if (this.mapInstance.getLayer(layerId)) {
      return new MapboxLayer({ gm: this.gm, layerId });
    }
    return null;
  }

  removeLayer(layerId: string) {
    const layer = this.getLayer(layerId);
    if (layer) {
      layer.remove();
    }
  }

  eachLayer(callback: (layer: BaseLayer<MapboxAnyLayer>) => void) {
    this.mapInstance.getStyle().layers.forEach((layer) => {
      callback(new MapboxLayer({ gm: this.gm, layerId: layer.id }));
    });
  }

  createDomMarker(options: BaseDomMarkerOptions, lngLat: LngLatTuple): BaseDomMarker {
    return new MapboxDomMarker({
      mapInstance: this.mapInstance,
      options,
      lngLat,
    });
  }

  createPopup(options: BasePopupOptions, lngLat?: LngLatTuple): BasePopup {
    return new MapboxPopup({
      mapInstance: this.mapInstance,
      options,
      lngLat,
    });
  }

  project(position: LngLatTuple) {
    const point = this.mapInstance.project(position);
    return [point.x, point.y] as ScreenPoint;
  }

  unproject(point: ScreenPoint) {
    const lngLat = this.mapInstance.unproject(point);
    return [lngLat.lng, lngLat.lat] as LngLatTuple;
  }

  coordBoundsToScreenBounds(bounds: [LngLatTuple, LngLatTuple]): [ScreenPoint, ScreenPoint] {
    const mbBounds = new mapboxgl.LngLatBounds(bounds);
    const sw = this.project(mbBounds.getSouthWest().toArray() as LngLatTuple);
    const ne = this.project(mbBounds.getNorthEast().toArray() as LngLatTuple);
    return [sw, ne];
  }

  fire(type: string, data?: unknown) {
    this.mapInstance.fire(type, data);
  }

  on(type: string, listener: BaseEventListener): void;
  on(type: string, layerId: string, listener: BaseEventListener): void;
  on(type: string, arg2: string | BaseEventListener, listener?: BaseEventListener): void {
    if (typeof arg2 === 'string' && listener && isMapboxSupportedPointerEventName(type)) {
      this.mapInstance.on(type, arg2, listener);
    } else if (typeof arg2 === 'function') {
      this.mapInstance.on(type, arg2);
    } else {
      throw new Error("Invalid arguments passed to 'on' method");
    }
  }

  once(type: string, listener: BaseEventListener): void;
  once(type: string, layerId: string, listener: BaseEventListener): void;
  once(type: string, arg2: string | BaseEventListener, listener?: BaseEventListener): void {
    if (typeof arg2 === 'string' && listener && isMapboxSupportedPointerEventName(type)) {
      this.mapInstance.once(type, arg2, listener);
    } else if (typeof arg2 === 'function') {
      this.mapInstance.once(type, arg2);
    } else {
      throw new Error("Invalid arguments passed to 'once' method.");
    }
  }

  off(type: string, listener: BaseEventListener): void;
  off(type: string, layerId: string, listener: BaseEventListener): void;
  off(type: string, arg2: string | BaseEventListener, listener?: BaseEventListener): void {
    if (typeof arg2 === 'string' && listener && isMapboxSupportedPointerEventName(type)) {
      this.mapInstance.off(type, arg2, listener);
    } else if (typeof arg2 === 'function') {
      this.mapInstance.off(type, arg2);
    } else {
      throw new Error("Invalid arguments passed to 'off' method");
    }
  }
}

export { MapboxAdapter as MapAdapter };
