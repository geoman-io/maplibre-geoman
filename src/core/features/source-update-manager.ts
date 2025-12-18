import { SOURCES } from '@/core/features/constants.ts';
import { FEATURE_ID_PROPERTY, type Geoman } from '@/main.ts';
import type { FeatureSourceName, GeoJsonUniversalDiff } from '@/types';
import { typedKeys, typedValues } from '@/utils/typing.ts';
import type { Feature } from 'geojson';
import { throttle } from 'lodash-es';

type SourceUpdateMethods = {
  [key in FeatureSourceName]: () => void;
};

const MAX_DIFF_ITEMS = 5000;

export class SourceUpdateManager {
  gm: Geoman;
  updateStorage: { [key in FeatureSourceName]: Array<GeoJsonUniversalDiff> };
  autoUpdatesEnabled: boolean = true;
  delayedSourceUpdateMethods: SourceUpdateMethods;
  // Track pending update promises per source to allow waiting for MapLibre to commit data
  // Using an array to track multiple concurrent promises (prevents overwriting if rapid updates occur)
  pendingUpdatePromises: { [key in FeatureSourceName]?: Promise<void>[] };

  constructor(gm: Geoman) {
    this.gm = gm;
    this.updateStorage = Object.fromEntries(typedValues(SOURCES).map((name) => [name, []]));
    this.pendingUpdatePromises = {};

    this.delayedSourceUpdateMethods = Object.fromEntries(
      typedValues(SOURCES).map((sourceName) => [
        sourceName,
        throttle(
          () => this.updateSourceActual(sourceName),
          this.gm.options.settings.throttlingDelay,
        ),
      ]),
    ) as SourceUpdateMethods;
  }

  updatesPending(sourceName: FeatureSourceName): boolean {
    return (
      !!this.updateStorage[sourceName]?.length ||
      !!(this.pendingUpdatePromises[sourceName]?.length ?? 0)
    );
  }

  getFeatureId(feature: Feature) {
    const id = feature.properties?.[FEATURE_ID_PROPERTY] ?? feature.id;
    if (id === null || id === undefined) {
      console.warn('Feature id is null or undefined', feature);
    }
    return id;
  }

  updateSource({
    sourceName,
    diff,
  }: {
    sourceName: FeatureSourceName;
    diff?: GeoJsonUniversalDiff;
  }) {
    if (diff) {
      this.updateStorage[sourceName].push(diff);
    }

    this.delayedSourceUpdateMethods[sourceName]();
  }

  updateSourceActual(sourceName: FeatureSourceName) {
    const source = this.gm.features.sources[sourceName];

    if (this.autoUpdatesEnabled && source) {
      if (!source.loaded) {
        setTimeout(() => {
          this.updateSourceActual(sourceName);
        }, this.gm.options.settings.throttlingDelay);
        return;
      }

      const combinedDiff = this.getCombinedDiff(sourceName);
      if (combinedDiff) {
        // Track the update promise so callers can wait for MapLibre to commit the data
        // MapLibre's updateData with waitForCompletion=true returns a Promise that
        // resolves when the data is committed to the source
        const updatePromise = source.updateData(combinedDiff);
        this.addPendingPromise(sourceName, updatePromise);
      }

      if (this.updateStorage[sourceName].length > 0) {
        setTimeout(
          () => this.updateSourceActual(sourceName),
          this.gm.options.settings.throttlingDelay,
        );
      }
    }
  }

  /**
   * Add a pending promise to the tracking array for a source.
   * Automatically removes the promise from the array when it resolves.
   */
  private addPendingPromise(sourceName: FeatureSourceName, promise: Promise<void>): void {
    if (!this.pendingUpdatePromises[sourceName]) {
      this.pendingUpdatePromises[sourceName] = [];
    }
    this.pendingUpdatePromises[sourceName].push(promise);

    // Remove from array when the promise resolves (success or failure)
    promise.finally(() => {
      const promises = this.pendingUpdatePromises[sourceName];
      if (promises) {
        const idx = promises.indexOf(promise);
        if (idx !== -1) {
          promises.splice(idx, 1);
        }
        // Clean up empty arrays
        if (promises.length === 0) {
          delete this.pendingUpdatePromises[sourceName];
        }
      }
    });
  }

  /**
   * Wait for any pending MapLibre source updates to complete.
   * This ensures data is committed before events are fired.
   *
   * When there are queued updates in updateStorage that haven't been processed yet
   * (due to throttling), this method flushes them immediately and waits for completion.
   *
   * Note: We call updateData() directly here rather than going through updateSourceActual()
   * because updateSourceActual() checks `!source.loaded` and may delay processing.
   * When waiting for pending updates (e.g., for event handlers), we need immediate processing.
   *
   * This is safe and won't cause duplicates because getCombinedDiff() atomically drains
   * the storage - whoever calls it first gets the diffs, subsequent calls get null.
   *
   * IMPORTANT: MapLibre's _updateWorkerData() has a guard that returns early if already
   * updating (`if (this._isUpdatingWorker) return`). This means updateData() can return
   * a promise that resolves before the data is actually committed to serialize().
   * To handle this, we loop until both storage and pending promises are empty, with
   * a microtask yield between iterations to allow MapLibre's recursive updates to run.
   */
  async waitForPendingUpdates(sourceName: FeatureSourceName): Promise<void> {
    const source = this.gm.features.sources[sourceName];
    if (!source) return;

    // Loop until all pending work is complete.
    // This handles the case where MapLibre's _updateWorkerData returns early due to
    // _isUpdatingWorker being true, and the actual data gets processed via the
    // recursive call in the finally block.
    while (this.updateStorage[sourceName]?.length || this.pendingUpdatePromises[sourceName]?.length) {
      // Flush any queued updates that haven't been processed yet
      if (this.updateStorage[sourceName]?.length) {
        const combinedDiff = this.getCombinedDiff(sourceName);
        if (combinedDiff) {
          const updatePromise = source.updateData(combinedDiff);
          this.addPendingPromise(sourceName, updatePromise);
        }
      }

      // Wait for all pending promises to complete
      const pendingPromises = this.pendingUpdatePromises[sourceName];
      if (pendingPromises?.length) {
        await Promise.all(pendingPromises);
      }

      // Yield to allow MapLibre's recursive _updateWorkerData calls to process
      // and potentially queue more work. Using setTimeout(0) ensures we go through
      // the task queue, giving MapLibre's async operations a chance to complete.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    // Final frame wait for serialize() to reflect the committed data
    await new Promise((resolve) => requestAnimationFrame(resolve));
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

  getCombinedDiff(sourceName: FeatureSourceName): GeoJsonUniversalDiff | null {
    let combinedDiff: GeoJsonUniversalDiff = {
      remove: [],
      add: [],
      update: [],
    };

    for (let i = 0; i < MAX_DIFF_ITEMS; i += 1) {
      if (this.updateStorage[sourceName][i] === undefined) {
        break;
      }
      combinedDiff = this.mergeGeoJsonDiff(combinedDiff, this.updateStorage[sourceName][i]);
    }
    this.updateStorage[sourceName] = this.updateStorage[sourceName].slice(MAX_DIFF_ITEMS);

    if (Object.values(combinedDiff).find((item) => item.length)) {
      return combinedDiff;
    }

    return null;
  }

  mergeGeoJsonDiff(
    pendingDiffOrNull: GeoJsonUniversalDiff | null,
    nextDiffOrNull: GeoJsonUniversalDiff | null,
  ): GeoJsonUniversalDiff {
    const pending: GeoJsonUniversalDiff = pendingDiffOrNull ?? { add: [], update: [], remove: [] };
    const next: GeoJsonUniversalDiff = nextDiffOrNull ?? { add: [], update: [], remove: [] };

    const nextRemoveIds = new Set(next.remove);

    const pendingAdd =
      pending.add?.filter((item) => !nextRemoveIds.has(this.getFeatureId(item))) || [];
    const pendingUpdate =
      pending.update?.filter((item) => !nextRemoveIds.has(this.getFeatureId(item))) || [];

    const nextUpdate: Array<Feature> = [];

    next.update?.forEach((updatedFeature) => {
      const pendingAddIdx = pendingAdd.findIndex(
        (item) => this.getFeatureId(item) === this.getFeatureId(updatedFeature),
      );
      const pendingUpdateIdx = pendingUpdate.findIndex(
        (item) => this.getFeatureId(item) === this.getFeatureId(updatedFeature),
      );

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
      add: [...pendingAdd, ...(next.add || [])],
      update: [...pendingUpdate, ...nextUpdate],
      remove: [...(pending.remove || []), ...(next.remove || [])],
    };
  }
}
