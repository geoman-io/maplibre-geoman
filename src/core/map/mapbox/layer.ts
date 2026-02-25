import { BaseLayer } from '@/core/map/base/layer.ts';
import type { Geoman } from '@/main.ts';
import type { MapboxAnyLayer } from '@mapLib/types/layers.ts';
import type { Map as MapboxMap } from 'mapbox-gl';
import log from 'loglevel';
import type { MapInstanceWithGeoman } from '@/types/map/index.ts';

type MapboxAddLayerObject = Parameters<MapboxMap['addLayer']>[0];

export class MapboxLayer extends BaseLayer<MapboxAnyLayer> {
  gm: Geoman;
  layerInstance: MapboxAnyLayer | null = null;
  mapInstance: MapboxMap;

  constructor({
    gm,
    layerId,
    options,
  }: {
    gm: Geoman;
    layerId: string;
    options?: MapboxAddLayerObject;
  }) {
    super();
    this.gm = gm;
    this.mapInstance = this.gm.mapAdapter.getMapInstance() as MapInstanceWithGeoman<MapboxMap>;

    if (options) {
      this.layerInstance = this.createLayer(options);
    } else {
      this.layerInstance = (this.mapInstance.getLayer(layerId) as MapboxAnyLayer) || null;
    }
  }

  get id(): string {
    if (!this.isInstanceAvailable()) {
      throw new Error('Layer instance is not available');
    }

    return this.layerInstance.id;
  }

  get source(): string {
    if (!this.isInstanceAvailable()) {
      throw new Error('Layer instance is not available');
    }

    return this.layerInstance.source as string;
  }

  createLayer(options: MapboxAddLayerObject): MapboxAnyLayer {
    let layer = this.mapInstance.getLayer(options.id) as MapboxAnyLayer | undefined;
    if (layer) {
      log.warn(`Layer "${options.id}" already exists, skipping`);
    } else {
      this.mapInstance.addLayer(options);
      layer = this.mapInstance.getLayer(options.id) as MapboxAnyLayer;
    }
    return layer ?? null;
  }

  remove(): void {
    if (this.isInstanceAvailable()) {
      this.mapInstance.removeLayer(this.id);
    }
    this.layerInstance = null;
  }
}
