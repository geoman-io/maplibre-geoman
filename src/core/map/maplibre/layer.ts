import { BaseLayer } from '@/core/map/base/layer.ts';
import type { MaplibreAnyLayer } from '@/core/map/maplibre/types.ts';
import type { Geoman } from '@/main.ts';
import ml from 'maplibre-gl';


export class MaplibreLayer extends BaseLayer<MaplibreAnyLayer> {
  gm: Geoman;
  layerInstance: MaplibreAnyLayer | null = null;
  mapInstance: ml.Map;

  constructor({ gm, layerId, options }: {
    gm: Geoman,
    layerId: string,
    options?: ml.AddLayerObject
  }) {
    super();
    this.gm = gm;
    this.mapInstance = this.gm.mapAdapter.mapInstance as ml.Map;

    if (options) {
      this.layerInstance = this.createLayer(options);
    } else {
      this.layerInstance = this.mapInstance.getLayer(layerId) as MaplibreAnyLayer || null;
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

    return this.layerInstance.source;
  }

  createLayer(options: ml.AddLayerObject): MaplibreAnyLayer {
    this.mapInstance.addLayer(options);
    return this.mapInstance.getLayer(options.id) as MaplibreAnyLayer || null;
  }

  remove(): void {
    if (this.isInstanceAvailable()) {
      this.mapInstance.removeLayer(this.id);
    }
    this.layerInstance = null;
  }
}

