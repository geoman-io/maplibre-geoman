import { BasePopup } from '@/core/map/base/popup.ts';
import type { BasePopupOptions, LngLatTuple } from '@/main.ts';
import mapboxgl from 'mapbox-gl';

export class MapboxPopup extends BasePopup<mapboxgl.Popup> {
  popupInstance: mapboxgl.Popup | null;

  constructor({
    mapInstance,
    options,
    lngLat,
  }: {
    mapInstance: mapboxgl.Map;
    options: BasePopupOptions;
    lngLat?: LngLatTuple;
  }) {
    super();
    this.popupInstance = new mapboxgl.Popup(options).addTo(mapInstance);
    if (lngLat) {
      this.setLngLat(lngLat);
    }
  }

  getLngLat(): LngLatTuple {
    if (!this.isInstanceAvailable()) {
      return [0, 0];
    }

    return this.popupInstance.getLngLat().toArray() || [0, 0];
  }

  setLngLat(lngLat: LngLatTuple) {
    if (!this.isInstanceAvailable()) {
      return;
    }

    this.popupInstance.setLngLat(lngLat);
  }

  setHtml(htmlContent: string): void {
    if (this.isInstanceAvailable()) {
      this.popupInstance.setHTML(htmlContent);
    }
  }

  remove() {
    if (this.isInstanceAvailable()) {
      this.popupInstance.remove();
    }
  }
}
