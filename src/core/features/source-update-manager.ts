import { type FeatureSourceName, type GeoJsonSourceDiff, type Geoman, SOURCES, typedKeys } from '@/main.ts';
import { typedValues } from '@/utils/typing.ts';


export class SourceUpdateManager {
  gm: Geoman;
  updateStorage: { [key in FeatureSourceName]: Array<GeoJsonSourceDiff> };
  autoUpdatesEnabled: boolean = true;

  constructor(gm: Geoman) {
    this.gm = gm;
    this.updateStorage = Object.fromEntries(
      typedValues(SOURCES).map((name) => [name, []])
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
    const updateStorage: Required<GeoJsonSourceDiff> = {
      remove: [],
      add: [],
      update: [],
    };

    this.updateStorage[sourceName].forEach((diff) => {
      if (diff.add) {
        updateStorage.add = updateStorage.add.concat(diff.add);
      }
      if (diff.update) {
        updateStorage.update = updateStorage.update.concat(diff.update);
      }
      if (diff.remove) {
        updateStorage.remove = updateStorage.remove.concat(diff.remove);
      }
    });

    this.updateStorage[sourceName] = [];
    return updateStorage;
  }
}
