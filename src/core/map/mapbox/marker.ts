import { BaseDomMarker } from '@/core/map/base/marker.ts';
import type { BaseDomMarkerOptions, LngLatTuple } from '@/main.ts';
import mapboxgl from 'mapbox-gl';

export class MapboxDomMarker extends BaseDomMarker<mapboxgl.Marker> {
  markerInstance: mapboxgl.Marker | null;

  constructor({
    mapInstance,
    options,
    lngLat,
  }: {
    mapInstance: mapboxgl.Map;
    options: BaseDomMarkerOptions;
    lngLat: LngLatTuple;
  }) {
    super();
    this.markerInstance = new mapboxgl.Marker(options).setLngLat(lngLat).addTo(mapInstance);
  }

  getElement(): HTMLElement | null {
    if (!this.isMarkerInstanceAvailable()) {
      return null;
    }

    return this.markerInstance?.getElement() || null;
  }

  setLngLat(lngLat: LngLatTuple) {
    if (!this.isMarkerInstanceAvailable()) {
      return;
    }
    this.markerInstance?.setLngLat(lngLat);
  }

  getLngLat(): LngLatTuple {
    if (!this.isMarkerInstanceAvailable()) {
      return [0, 0];
    }

    return this.markerInstance?.getLngLat().toArray() || [0, 0];
  }

  remove() {
    this.markerInstance?.remove();
  }
}
