import { SOURCES } from '@/core/features/constants.ts';
import { FEATURE_ID_PROPERTY, type Geoman } from '@/main.ts';
import type { FeatureSourceName, GeoJSONFeatureDiff, GeoJSONSourceDiffHashed } from '@/types';
import { typedValues } from '@/utils/typing.ts';
import type { Feature } from 'geojson';
import { throttle } from 'lodash-es';

type SourceUpdateMethods = {
  [key in FeatureSourceName]: () => void;
};

type UpdateMethod = 'automatic' | 'transactional-update' | 'transactional-set';

export class SourceUpdateManager {
  gm: Geoman;
  updateStorage: {
    [key in FeatureSourceName]: {
      diff: GeoJSONSourceDiffHashed | null;
      method: UpdateMethod;
    };
  };
  delayedSourceUpdateMethods: SourceUpdateMethods;
  // Track pending update promises per source to allow waiting for MapLibre to commit data
  // Using an array to track multiple concurrent promises (prevents overwriting if rapid updates occur)
  pendingUpdatePromises: { [key in FeatureSourceName]?: Promise<void>[] };

  constructor(gm: Geoman) {
    this.gm = gm;
    this.pendingUpdatePromises = {};
    this.updateStorage = Object.fromEntries(
      typedValues(SOURCES).map((name) => [name, { diff: null, method: 'automatic' }]),
    );

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

  beginTransaction(method: UpdateMethod, sourceName?: FeatureSourceName) {
    const sourceNames = sourceName ? [sourceName] : Object.values(SOURCES);

    sourceNames.forEach((sourceName) => {
      this.updateStorage[sourceName].method = method;
    });
  }

  updatesPending(sourceName: FeatureSourceName): boolean {
    return (
      this.updateStorage[sourceName].diff !== null ||
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
    diff?: GeoJSONSourceDiffHashed;
  }) {
    if (diff) {
      if (this.updateStorage[sourceName].method === 'transactional-set') {
        if (!this.updateStorage[sourceName].diff) {
          this.updateStorage[sourceName].diff = {};
        }
        if (diff.update) {
          console.error('In transactional-set updates are not allowed');
        }
        // Merge is processed by mutating the diff object.
        // This is essential for performance - avoiding mutation would significantly degrade the improvements
        this.mergeGeoJsonDiff(this.updateStorage[sourceName].diff, diff);
      } else {
        if (!this.updateStorage[sourceName].diff) {
          this.updateStorage[sourceName].diff = {};
        }
        // Idem
        this.mergeGeoJsonDiff(this.updateStorage[sourceName].diff, diff);
      }
    }

    if (this.updateStorage[sourceName].method === 'automatic') {
      this.delayedSourceUpdateMethods[sourceName]();
    }
  }

  updateSourceActual(sourceName: FeatureSourceName) {
    const source = this.gm.features.sources[sourceName];

    if (this.updateStorage[sourceName].method === 'automatic' && source) {
      if (!source.loaded) {
        setTimeout(() => {
          this.updateSourceActual(sourceName);
        }, this.gm.options.settings.throttlingDelay);
        return;
      }

      if (this.updateStorage[sourceName].diff) {
        // Track the update promise so callers can wait for MapLibre to commit the data
        // MapLibre's updateData with waitForCompletion=true returns a Promise that
        // resolves when the data is committed to the source
        const updatePromise = source.updateData(this.updateStorage[sourceName].diff);
        this.addPendingPromise(sourceName, updatePromise);

        this.updateStorage[sourceName].diff = null;
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
    while (this.updateStorage[sourceName].diff || this.pendingUpdatePromises[sourceName]?.length) {
      // Flush any queued updates that haven't been processed yet
      if (this.updateStorage[sourceName].diff) {
        const updatePromise = source.updateData(this.updateStorage[sourceName].diff);
        this.addPendingPromise(sourceName, updatePromise);
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

  commitTransaction(sourceName?: FeatureSourceName) {
    const sourceNames = sourceName ? [sourceName] : Object.values(SOURCES);

    sourceNames.forEach((sourceName) => {
      const source = this.gm.features.sources[sourceName];

      if (!source || !this.updateStorage[sourceName].diff) {
        return;
      }

      if (this.updateStorage[sourceName].method === 'transactional-set') {
        const features = this.updateStorage[sourceName].diff.add?.values() ?? [];
        source.setData({
          type: 'FeatureCollection',
          features: Array.from(features),
        });
        // source.updateData(this.updateStorage[sourceName].diff);
      } else if (this.updateStorage[sourceName].method === 'transactional-update') {
        source.updateData(this.updateStorage[sourceName].diff);
      }

      this.updateStorage[sourceName].diff = null;
      this.updateStorage[sourceName].method = 'automatic';
    });
  }

  mergeGeoJsonDiff(prev: GeoJSONSourceDiffHashed, next: GeoJSONSourceDiffHashed) {
    // Resolve merge conflicts
    SourceUpdateManager.resolveMergeConflicts(prev, next);

    if (prev.removeAll || next.removeAll) prev.removeAll = true;

    if (next.remove && !prev.remove) {
      prev.remove = new Set();
    }
    next.remove?.forEach((value) => {
      prev.remove?.add(value);
    });

    if (next.add && !prev.add) {
      prev.add = new Map();
    }
    next.add?.forEach((value, key) => {
      prev.add?.set(key, value);
    });

    if (next.update && !prev.update) {
      prev.update = new Map();
    }
    next.update?.forEach((value, key) => {
      prev.update?.set(key, value);
    });

    if (prev.remove?.size && prev.add?.size) {
      for (const id of prev.add.keys()) {
        prev.remove.delete(id);
      }
    }
  }

  /**
   * Resolve merge conflicts between two GeoJSONSourceDiffs considering the ordering above (remove/add/update).
   *
   * - If you `removeAll` and then `add` features in the same diff, the added features will be kept.
   * - Updates only apply to features that exist after removes and adds have been processed.
   */
  private static resolveMergeConflicts(
    prev: GeoJSONSourceDiffHashed,
    next: GeoJSONSourceDiffHashed,
  ) {
    // Removing all features with added or updated features in previous - and clear no-op removes

    if (next.removeAll) {
      prev.add?.clear();
      prev.update?.clear();
      prev.remove?.clear();
      next.remove?.clear();
    }

    // Removing features that were added or updated in previous
    if (next.remove) {
      for (const id of next.remove) {
        prev.add?.delete(id);
        prev.update?.delete(id);
      }
    }

    // Updating features that were updated in previous
    if (next.update) {
      for (const [id, nextUpdate] of next.update) {
        const prevUpdate = prev.update?.get(id);
        if (!prevUpdate) continue;

        next.update?.set(id, SourceUpdateManager.mergeFeatureDiffs(prevUpdate, nextUpdate));
        prev.update?.delete(id);
      }
    }
  }

  /**
   * Merge two feature diffs for the same feature id, considering the order of operations as specified above (remove, add/update).
   */
  private static mergeFeatureDiffs(
    prev: GeoJSONFeatureDiff,
    next: GeoJSONFeatureDiff,
  ): GeoJSONFeatureDiff {
    const merged: GeoJSONFeatureDiff = { id: prev.id };

    // Removing all properties with added or updated properties in previous - and clear no-op removes
    if (next.removeAllProperties) {
      delete prev.removeProperties;
      delete prev.addOrUpdateProperties;
      delete next.removeProperties;
    }
    // Removing properties that were added or updated in previous
    if (next.removeProperties) {
      for (const key of next.removeProperties) {
        const index = prev.addOrUpdateProperties?.findIndex((prop) => prop.key === key) ?? -1;
        if (index > -1) prev.addOrUpdateProperties?.splice(index, 1);
      }
    }

    // Merge the two diffs
    if (prev.removeAllProperties || next.removeAllProperties) {
      merged.removeAllProperties = true;
    }
    if (prev.removeProperties || next.removeProperties) {
      merged.removeProperties = [
        ...(prev.removeProperties || []),
        ...(next.removeProperties || []),
      ];
    }
    if (prev.addOrUpdateProperties || next.addOrUpdateProperties) {
      merged.addOrUpdateProperties = [
        ...(prev.addOrUpdateProperties || []),
        ...(next.addOrUpdateProperties || []),
      ];
    }
    if (prev.newGeometry || next.newGeometry) {
      merged.newGeometry = next.newGeometry || prev.newGeometry;
    }

    return merged;
  }
}
