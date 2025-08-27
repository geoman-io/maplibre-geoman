import { type FeatureSourceName, type GeoJsonSourceDiff, type Geoman, SOURCES, typedKeys } from '@/main.ts';
import { typedValues } from '@/utils/typing.ts';
import type { Feature } from 'geojson';
import { debounce, throttle } from 'lodash-es';

type SourceUpdateMethods = {
  [key in FeatureSourceName]: {
    debounced: () => void,
    throttled: () => void,
  }
};

export class SourceUpdateManager {
  gm: Geoman;
  updateStorage: { [key in FeatureSourceName]: Array<GeoJsonSourceDiff> };
  autoUpdatesEnabled: boolean = true;
  delayedSourceUpdateMethods: SourceUpdateMethods;

  constructor(gm: Geoman) {
    this.gm = gm;
    this.updateStorage = Object.fromEntries(
      typedValues(SOURCES).map((name) => [name, []]),
    );

    this.delayedSourceUpdateMethods = Object.fromEntries(
      typedValues(SOURCES).map((sourceName) => [
        sourceName,
        {
          throttled: this.getDelayedSourceUpdateMethod({
            sourceName,
            type: 'throttled',
          }),
          debounced: this.getDelayedSourceUpdateMethod({
            sourceName,
            type: 'debounced',
          }),
        } as { debounced: () => void, throttled: () => void },
      ]),
    ) as SourceUpdateMethods;
  }

  getDelayedSourceUpdateMethod(
    { sourceName, type }: {
      sourceName: FeatureSourceName,
      type: 'throttled' | 'debounced',
    },
  ) {
    if (type === 'throttled') {
      return throttle(
        () => this.updateSourceActual(sourceName),
        2 * this.gm.options.settings.throttlingDelay,
        { leading: false, trailing: true },
      );
    } else if (type === 'debounced') {
      return debounce(
        () => this.updateSourceActual(sourceName),
        2 * this.gm.options.settings.throttlingDelay,
        { leading: true, trailing: false },
      );
    } else {
      throw new Error('Features: getDelayedSourceUpdateMethod: invalid type');
    }
  }

  updateSource({ sourceName, diff }: {
    sourceName: FeatureSourceName
    diff?: GeoJsonSourceDiff,
  }) {
    if (diff) {
      this.updateStorage[sourceName].push(diff);
    }

    this.delayedSourceUpdateMethods[sourceName].throttled();
    this.delayedSourceUpdateMethods[sourceName].debounced();
  }

  updateSourceActual(sourceName: FeatureSourceName) {
    if (this.autoUpdatesEnabled) {
      const source = this.gm.features.sources[sourceName];
      // log.debug(`source: ${sourceName}, diffs count: ${this.updateStorage[sourceName].length}`);
      const combinedDiff = this.getCombinedDiff(sourceName);
      // log.debug(`source: ${sourceName}, diff`, JSON.stringify(combinedDiff, null, 2));
      if (source) {
        source.updateData(combinedDiff);
      }
    }
  }

  withAtomicSourcesUpdate<T>(callback: () => T): T {
    try {
      this.autoUpdatesEnabled = false;
      return callback();
    } finally {
      typedKeys(this.gm.features.sources).forEach((sourceName) => {
        this.updateSource({ sourceName });
      });
      this.autoUpdatesEnabled = true;
    }
  }

  getCombinedDiff(sourceName: FeatureSourceName) {
    let combinedDiff: GeoJsonSourceDiff = {
      remove: [],
      add: [],
      update: [],
    };

    this.updateStorage[sourceName].forEach((diff) => {
      combinedDiff = this.mergeGeoJsonDiff(combinedDiff, diff);
    });

    this.updateStorage[sourceName] = [];
    return combinedDiff;
  }

  mergeGeoJsonDiff(
    pendingDiffOrNull: GeoJsonSourceDiff | null,
    nextDiffOrNull: GeoJsonSourceDiff | null,
  ): GeoJsonSourceDiff {
    const pending: GeoJsonSourceDiff = pendingDiffOrNull ?? { add: [], update: [], remove: [] };
    const next: GeoJsonSourceDiff = nextDiffOrNull ?? { add: [], update: [], remove: [] };

    const nextRemoveIds = new Set(next.remove);

    const pendingAdd = pending.add?.filter((item) => !nextRemoveIds.has(item.id!)) || [];
    const pendingUpdate = pending.update?.filter((item) => !nextRemoveIds.has(item.id!)) || [];

    const nextUpdate: Array<Feature> = [];

    next.update?.forEach((updatedFeature) => {
      const pendingAddIdx = pendingAdd.findIndex((item) => item.id === updatedFeature.id);
      const pendingUpdateIdx = pendingUpdate.findIndex((item) => item.id === updatedFeature.id);

      if (pendingAddIdx === -1 && pendingUpdateIdx === -1) {
        nextUpdate.push(updatedFeature);
        return;
      }
      if (pendingAddIdx !== -1) {
        pendingAdd[pendingAddIdx] = updatedFeature;
      }
      if (pendingUpdateIdx !== -1) {
        pendingUpdate[pendingUpdateIdx] = updatedFeature;
      }
    });

    return {
      add: [...pendingAdd, ...next.add || []],
      update: [...pendingUpdate, ...nextUpdate],
      remove: [...pending.remove || [], ...next.remove || []],
    };
  }
}
