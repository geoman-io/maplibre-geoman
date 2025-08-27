import { type FeatureSourceName, type GeoJsonSourceDiff, type Geoman, SOURCES, typedKeys } from '@/main.ts';
import { typedValues } from '@/utils/typing.ts';
import type { Feature } from 'geojson';
import log from 'loglevel';


export class SourceUpdateManager {
  gm: Geoman;
  updateStorage: { [key in FeatureSourceName]: Array<GeoJsonSourceDiff> };
  autoUpdatesEnabled: boolean = true;

  constructor(gm: Geoman) {
    this.gm = gm;
    this.updateStorage = Object.fromEntries(
      typedValues(SOURCES).map((name) => [name, []]),
    );
  }

  updateSource({ sourceName, diff }: {
    sourceName: FeatureSourceName
    diff?: GeoJsonSourceDiff,
  }) {
    if (diff) {
      this.updateStorage[sourceName].push(diff);
    }

    if (this.autoUpdatesEnabled) {
      const source = this.gm.features.sources[sourceName];
      log.debug(`source: ${sourceName}, diffs count: ${this.updateStorage[sourceName].length}`);
      const combinedDiff = this.getCombinedDiff(sourceName);
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

    const pendingAdd = pending.add?.filter((f) => !nextRemoveIds.has(f.id!)) || [];
    const pendingUpdate = pending.update?.filter((f) => !nextRemoveIds.has(f.id!)) || [];

    const nextUpdate: Array<Feature> = [];

    next.update?.forEach((updatedFeature) => {
      const pendingAddIdx = pendingAdd.findIndex(f => f.id === updatedFeature.id);
      const pendingUpdateIdx = pendingUpdate.findIndex(f => f.id === updatedFeature.id);

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
