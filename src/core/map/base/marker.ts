import type { LngLat } from '@/main.ts';
import log from 'loglevel';

export abstract class BaseDomMarker<TMarkerInstance = unknown> {
  abstract markerInstance: TMarkerInstance | null;

  abstract getElement(): HTMLElement | null;

  abstract setLngLat(lngLat: LngLat): void;

  abstract getLngLat(): LngLat;

  abstract remove(): void;

  isMarkerInstanceAvailable(): this is { markerInstance: TMarkerInstance } {
    if (this.markerInstance) {
      return true;
    }

    log.error('Marker instance is not available');
    return false;
  }
}
