import { BasePopup } from '@/core/map/base/popup.ts';
import type { BasePopupOptions, LngLat } from '@/main.ts';
import ml from 'maplibre-gl';


export class MaplibrePopup extends BasePopup<ml.Popup> {
  popupInstance: ml.Popup | null;

  constructor({ mapInstance, options, lngLat }: {
    mapInstance: ml.Map,
    options: BasePopupOptions,
    lngLat?: LngLat,
  }) {
    super();
    this.popupInstance = new ml.Popup(options).addTo(mapInstance);
    if (lngLat) {
      this.setLngLat(lngLat);
    }
  }

  getLngLat(): LngLat {
    if (!this.isInstanceAvailable()) {
      return [0, 0];
    }

    return this.popupInstance.getLngLat().toArray() || [0, 0];
  }

  setLngLat(lngLat: LngLat) {
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
