import type { LngLat } from '@/main.ts';
import log from 'loglevel';

export abstract class BasePopup<TPopupInstance = unknown> {
  abstract popupInstance: TPopupInstance | null;

  abstract setLngLat(lngLat: LngLat): void;

  abstract setHtml(htmlContent: string): void;

  abstract remove(): void;

  isInstanceAvailable(): this is { popupInstance: TPopupInstance } {
    if (this.popupInstance) {
      return true;
    }

    log.error('Popup instance is not available');
    return false;
  }
}
