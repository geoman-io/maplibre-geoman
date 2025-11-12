import { defaultOptions } from '@/core/options/defaults/free.ts';
import { throttle } from 'lodash-es';
import type { GeoJSONSource, GeoJSONSourceDiff } from 'maplibre-gl';
import { MAX_DIFF_ITEMS } from './config.ts';
import { mergeSourceDiffs } from './geojson_source_diff.ts';

const { throttlingDelay } = defaultOptions.settings;

export class SourceUpdateManager {
  queue: GeoJSONSourceDiff[] = [];

  throtledUpdateSource: () => void;

  constructor(public source: GeoJSONSource) {
    this.throtledUpdateSource = throttle(this.updateSourceActual, throttlingDelay);
  }

  updateSource(diff?: GeoJSONSourceDiff) {
    if (diff) {
      this.queue.push(diff);
    }

    this.throtledUpdateSource();
  }
  updateSourceActual = () => {
    if (!this.source.loaded) {
      setTimeout(this.updateSourceActual, throttlingDelay);
      return;
    }

    const combinedDiff = this.getCombinedDiff();
    if (combinedDiff) {
      console.log('intermediate source updateData', combinedDiff);
      this.source.updateData(combinedDiff);
    }

    if (this.queue.length > 0) {
      setTimeout(this.updateSourceActual, throttlingDelay);
    }
  };

  getCombinedDiff(): GeoJSONSourceDiff | null {
    let combinedDiff: GeoJSONSourceDiff = {};

    for (let i = 0; i < MAX_DIFF_ITEMS; i += 1) {
      combinedDiff = mergeSourceDiffs(combinedDiff, this.queue[i]);
    }

    this.queue = this.queue.slice(MAX_DIFF_ITEMS);

    if (Object.values(combinedDiff).find((item) => typeof item === 'boolean' || item.length)) {
      return combinedDiff;
    }

    return null;
  }
}
