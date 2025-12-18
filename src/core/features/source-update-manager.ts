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
  pendingUpdatePromises: { [key in FeatureSourceName]?: Promise<void> };
  // Track entire update chains from queue to completion (handles source.loaded=false case)
  private activeUpdateChains: {
    [key in FeatureSourceName]?: { promise: Promise<void>; resolve: () => void; resolved: boolean };
  } = {};

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
    return !!(
      this.updateStorage[sourceName]?.length ||
      this.pendingUpdatePromises[sourceName] ||
      this.activeUpdateChains[sourceName]
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

    // Create a chain promise when work is queued (tracks from queue to MapLibre commit)
    // If an old resolved chain exists, replace it with a fresh one
    if (!this.activeUpdateChains[sourceName] || this.activeUpdateChains[sourceName]!.resolved) {
      let resolveChain: () => void;
      const chainPromise = new Promise<void>((resolve) => {
        resolveChain = resolve;
      });
      this.activeUpdateChains[sourceName] = {
        promise: chainPromise,
        resolve: resolveChain!,
        resolved: false,
      };
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
        this.pendingUpdatePromises[sourceName] = updatePromise;
        updatePromise.then(() => {
          // Clear the promise once the update is complete
          if (this.pendingUpdatePromises[sourceName] === updatePromise) {
            delete this.pendingUpdatePromises[sourceName];
          }
          // Resolve the chain if all work is complete
          this.tryResolveUpdateChain(sourceName);
        });
      } else {
        // No diff to send, check if chain can be resolved
        this.tryResolveUpdateChain(sourceName);
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
   * Resolve the update chain if all work for this source is complete.
   * The chain is marked as resolved but NOT deleted - this allows waitForPendingUpdates
   * to still find and await it even if the update completed before the await was called.
   */
  private tryResolveUpdateChain(sourceName: FeatureSourceName) {
    const hasQueuedUpdates = this.updateStorage[sourceName]?.length > 0;
    const hasPendingPromise = !!this.pendingUpdatePromises[sourceName];

    if (!hasQueuedUpdates && !hasPendingPromise) {
      const chain = this.activeUpdateChains[sourceName];
      if (chain && !chain.resolved) {
        chain.resolved = true;
        chain.resolve();
        // Don't delete - waitForPendingUpdates may still need to await this resolved promise
      }
    }
  }

  /**
   * Wait for any pending MapLibre source updates to complete.
   * This ensures data is committed before events are fired.
   *
   * This method handles:
   * - Queued updates (in updateStorage)
   * - In-flight MapLibre updates (in pendingUpdatePromises)
   * - Update chains that include setTimeout retries (in activeUpdateChains)
   */
  async waitForPendingUpdates(sourceName: FeatureSourceName): Promise<void> {
    // Capture the chain reference FIRST - even if it's already resolved,
    // we need to await it to ensure the data was committed
    const chain = this.activeUpdateChains[sourceName];

    // If there are queued updates, flush them immediately (bypassing throttle)
    if (this.updateStorage[sourceName]?.length) {
      this.updateSourceActual(sourceName);
    }

    // Wait for the update chain (may already be resolved, which is fine - await returns immediately)
    if (chain) {
      await chain.promise;
      // Clean up the resolved chain after awaiting
      if (chain.resolved && this.activeUpdateChains[sourceName] === chain) {
        delete this.activeUpdateChains[sourceName];
      }
    }

    // Also wait for any in-flight MapLibre update
    const pendingPromise = this.pendingUpdatePromises[sourceName];
    if (pendingPromise) {
      await pendingPromise;
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
