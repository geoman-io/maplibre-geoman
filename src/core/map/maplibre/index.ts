import GmControl from '@/core/controls/index.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import { BaseMapAdapter } from '@/core/map/base/index.ts';
import type { BaseLayer } from '@/core/map/base/layer.ts';
import { BaseDomMarker } from '@/core/map/base/marker.ts';
import type { BasePopup } from '@/core/map/base/popup.ts';
import { MaplibreLayer } from '@/core/map/maplibre/layer.ts';
import { MaplibreDomMarker } from '@/core/map/maplibre/marker.ts';
import { MaplibrePopup } from '@/core/map/maplibre/popup.ts';
import { MaplibreSource } from '@/core/map/maplibre/source.ts';
import {
  type BaseDomMarkerOptions,
  type BaseEventListener,
  type BaseFitBoundsOptions,
  type BasePopupOptions,
  type CursorType,
  FEATURE_ID_PROPERTY,
  type FeatureId,
  type FeatureSourceName,
  type GeoJsonFeatureData,
  type GeoJsonImportFeature,
  type Geoman,
  type LngLat,
  type MapInstanceWithGeoman,
  type MapInteraction,
  type MapTypes,
  type ScreenPoint,
} from '@/main.ts';
import type { MaplibreAnyLayer } from '@mapLib/types/layers.ts';
import type { GeoJSON } from 'geojson';
import { isEqual, uniqWith } from 'lodash-es';
import ml from 'maplibre-gl';
import { isMaplibreSupportedPointerEventName } from '@/core/map/maplibre/guards.ts';

export class MaplibreAdapter extends BaseMapAdapter<
  MapInstanceWithGeoman<ml.Map>,
  ml.GeoJSONSource,
  MaplibreAnyLayer
> {
  gm: Geoman;
  mapType: keyof MapTypes = 'maplibre';
  mapInstance: MapInstanceWithGeoman<ml.Map>;

  constructor(map: unknown, gm: Geoman) {
    super();
    this.gm = gm;
    this.mapInstance = map as MapInstanceWithGeoman<ml.Map>;
  }

  getMapInstance(): MapInstanceWithGeoman<ml.Map> {
    return this.mapInstance;
  }

  isLoaded(): boolean {
    return this.mapInstance.loaded();
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
      const loadedImage = await this.mapInstance.loadImage(image);
      this.mapInstance.addImage(id, loadedImage.data);
    }
  }

  getBounds(): [LngLat, LngLat] {
    const mapBounds = this.mapInstance.getBounds();
    return mapBounds.toArray() as [LngLat, LngLat];
  }

  fitBounds(bounds: [LngLat, LngLat], options?: BaseFitBoundsOptions) {
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

  queryFeaturesByScreenCoordinates({
    queryCoordinates = undefined,
    sourceNames,
  }: {
    queryCoordinates?: ScreenPoint | [ScreenPoint, ScreenPoint];
    sourceNames: Array<FeatureSourceName>;
  }): Array<FeatureData> {
    const features = uniqWith(
      this.mapInstance.queryRenderedFeatures(queryCoordinates).map((feature) => ({
        featureId: feature.properties[FEATURE_ID_PROPERTY] as FeatureId | undefined,
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
      this.mapInstance.queryRenderedFeatures(queryCoordinates).map((feature) => {
        const geoJson = this.convertToGeoJsonImportFeature(feature);
        if (!geoJson) {
          return null;
        }
        return {
          id: feature.properties[FEATURE_ID_PROPERTY] as FeatureId | undefined,
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

  convertToGeoJsonImportFeature(feature: ml.MapGeoJSONFeature): GeoJsonImportFeature | null {
    const featureId = feature.properties[FEATURE_ID_PROPERTY] as FeatureId | undefined;
    if (featureId === undefined || feature.geometry.type === 'GeometryCollection') {
      return null;
    }

    return {
      id: featureId,
      type: 'Feature',
      properties: feature.properties,
      geometry: feature.geometry,
    };
  }

  addSource(sourceId: string, geoJson: GeoJSON): MaplibreSource {
    return new MaplibreSource({ gm: this.gm, sourceId, geoJson });
  }

  getSource(sourceId: string): MaplibreSource {
    return new MaplibreSource({ gm: this.gm, sourceId });
  }

  addLayer(options: ml.AddLayerObject): MaplibreLayer {
    const layerId = options.id;
    return new MaplibreLayer({ gm: this.gm, layerId, options });
  }

  getLayer(layerId: string): BaseLayer<MaplibreAnyLayer> | null {
    if (this.mapInstance.getLayer(layerId)) {
      return new MaplibreLayer({ gm: this.gm, layerId });
    }
    return null;
  }

  removeLayer(layerId: string) {
    const layer = this.getLayer(layerId);
    if (layer) {
      layer.remove();
    }
  }

  eachLayer(callback: (layer: BaseLayer<MaplibreAnyLayer>) => void) {
    this.mapInstance.getStyle().layers.forEach((layer) => {
      callback(new MaplibreLayer({ gm: this.gm, layerId: layer.id }));
    });
  }

  createDomMarker(options: BaseDomMarkerOptions, lngLat: LngLat): BaseDomMarker {
    return new MaplibreDomMarker({
      mapInstance: this.mapInstance,
      options,
      lngLat,
    });
  }

  createPopup(options: BasePopupOptions, lngLat?: LngLat): BasePopup {
    return new MaplibrePopup({
      mapInstance: this.mapInstance,
      options,
      lngLat,
    });
  }

  project(position: LngLat) {
    const point = this.mapInstance.project(position);
    return [point.x, point.y] as ScreenPoint;
  }

  unproject(point: ScreenPoint) {
    const lngLat = this.mapInstance.unproject(point);
    return [lngLat.lng, lngLat.lat] as LngLat;
  }

  coordBoundsToScreenBounds(bounds: [LngLat, LngLat]): [ScreenPoint, ScreenPoint] {
    const mlBounds = new ml.LngLatBounds(bounds);
    const sw = this.project(mlBounds.getSouthWest().toArray());
    const ne = this.project(mlBounds.getNorthEast().toArray());
    return [sw, ne];
  }

  fire(type: string, data?: unknown) {
    this.mapInstance.fire(type, data);
  }

  on(type: string, listener: BaseEventListener): void;
  on(type: string, layerId: string, listener: BaseEventListener): void;
  on(type: string, arg2: string | BaseEventListener, listener?: BaseEventListener): void {
    if (typeof arg2 === 'string' && listener && isMaplibreSupportedPointerEventName(type)) {
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
    // note: it's possible to have promise returned from maplibre-gl
    // (it's not implemented for this adapter)
    if (typeof arg2 === 'string' && listener && isMaplibreSupportedPointerEventName(type)) {
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
    if (typeof arg2 === 'string' && listener && isMaplibreSupportedPointerEventName(type)) {
      this.mapInstance.off(type, arg2, listener);
    } else if (typeof arg2 === 'function') {
      this.mapInstance.off(type, arg2);
    } else {
      throw new Error("Invalid arguments passed to 'off' method");
    }
  }
}
