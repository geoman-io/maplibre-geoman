import { BaseSource } from '@/core/map/base/source.ts';
import { FEATURE_ID_PROPERTY } from '@/core/features/constants.ts';
import type { Geoman } from '@/main.ts';
import { SHAPE_NAMES } from '@/modes/constants.ts';
import type { GeoJsonShapeFeatureCollection } from '@/types/geojson.ts';
import type { GeoJSONSourceDiffHashed, MapInstanceWithGeoman } from '@/types/map/index.ts';
import type { ShapeName } from '@/types/modes/index.ts';
import { withPromiseTimeoutRace } from '@/utils/behavior.ts';
import type { Feature, FeatureCollection, GeoJSON } from 'geojson';
import log from 'loglevel';
import type {
  GeoJSONSource as MapboxGeoJSONSource,
  Map as MapboxMap,
  MapSourceDataEvent,
} from 'mapbox-gl';

export class MapboxSource extends BaseSource<MapboxGeoJSONSource> {
  gm: Geoman;
  mapInstance: MapboxMap;
  sourceInstance: MapboxGeoJSONSource | null;

  constructor({ gm, geoJson, sourceId }: { gm: Geoman; sourceId: string; geoJson?: GeoJSON }) {
    super();
    this.gm = gm;
    this.mapInstance = this.gm.mapAdapter.getMapInstance() as MapInstanceWithGeoman<MapboxMap>;

    if (geoJson) {
      this.sourceInstance = this.createSource({ geoJson, sourceId });
    } else {
      this.sourceInstance = (this.mapInstance.getSource(sourceId) as MapboxGeoJSONSource) || null;
    }
  }

  get id(): string {
    if (!this.isInstanceAvailable()) {
      throw new Error('Source instance is not available');
    }

    return this.sourceInstance.id;
  }

  get loaded(): boolean {
    return this.mapInstance.isSourceLoaded(this.id);
  }

  createSource({ geoJson, sourceId }: { sourceId: string; geoJson: GeoJSON }): MapboxGeoJSONSource {
    let source = this.mapInstance.getSource(sourceId) as MapboxGeoJSONSource | undefined;
    if (source) {
      log.warn(`Source "${source.id}" already exists, skipping`);
    } else {
      this.mapInstance.addSource(sourceId, {
        type: 'geojson',
        dynamic: true,
        data: geoJson,
        promoteId: FEATURE_ID_PROPERTY,
      });
      source = this.mapInstance.getSource(sourceId) as MapboxGeoJSONSource;
    }
    return source ?? null;
  }

  getGeoJson() {
    if (!this.isInstanceAvailable()) {
      throw new Error('Source instance is not available');
    }
    return this.sourceInstance.serialize().data as GeoJsonShapeFeatureCollection;
  }

  getGmGeoJson() {
    if (!this.isInstanceAvailable()) {
      throw new Error('Source instance is not available');
    }

    // this method retrieves features geojson according to internal representation
    // for each FeatureData.
    // In other words it collects "FeatureData._geoJson" for each feature in a source
    const resultFeatureCollection: GeoJsonShapeFeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    const sourceForEach = this.gm.features.filteredForEach(
      (featureData) => featureData.source.id === this.sourceInstance?.id,
    );

    sourceForEach((featureData) => {
      if (SHAPE_NAMES.includes(featureData.shape as ShapeName)) {
        resultFeatureCollection.features.push(featureData.getGeoJson());
      }
    });
    return resultFeatureCollection;
  }

  async setData(geoJson: GeoJSON) {
    if (!this.isInstanceAvailable()) {
      throw new Error('Source instance is not available');
    }
    const source = this.sourceInstance;
    await this.commitData(() => source.setData(geoJson));
  }

  async updateData(hashedDiff: GeoJSONSourceDiffHashed) {
    if (!this.isInstanceAvailable()) {
      return;
    }

    // Mapbox GL JS does not have an incremental diff API like MapLibre's
    // source.updateData(). We apply the diff to the current data manually
    // and call setData() with the full updated collection.
    const currentData = this.getGeoJson();
    const updated = MapboxSource.applyDiff(currentData, hashedDiff);
    const source = this.sourceInstance;
    await this.commitData(() => source.setData(updated));
  }

  /**
   * @internal
   * Apply data to the source and resolve once Mapbox has actually committed it.
   *
   * Mapbox GL JS's `setData()` is synchronous and fire-and-forget: it returns the source
   * immediately, before the worker has parsed the data and the tiles have been rebuilt.
   * `BaseSource` declares `setData`/`updateData` as `Promise<void>` and `SourceUpdateManager`
   * awaits them to know when data is committed (see `waitForPendingUpdates`), so without this
   * the wait is a no-op on Mapbox and callers can read stale data. MapLibre gets the same
   * guarantee for free from `GeoJSONSource.updateData()`.
   *
   * The listener is registered before the data is applied so the commit event cannot be missed.
   * Like MapLibre's own update promise, this resolves rather than rejects on failure — a source
   * that stops reporting is logged and the caller continues instead of hanging.
   *
   * Note: Mapbox emits a burst of `sourcedata` events per update and does not populate
   * `sourceDataType` for GeoJSON sources, so `isSourceLoaded()` is the only usable signal —
   * filtering on `sourceDataType === 'content'` matches nothing and hangs. Resolving marginally
   * early is safe: `SourceUpdateManager.waitForPendingUpdates` also loops on `source.loaded`.
   */
  private async commitData(applyData: () => void): Promise<void> {
    const sourceId = this.id;
    let removeListener = () => {};

    const committed = new Promise<void>((resolve) => {
      const onSourceData = (event: MapSourceDataEvent) => {
        if (event.sourceId !== sourceId || !this.mapInstance.isSourceLoaded(sourceId)) {
          return;
        }
        removeListener();
        resolve();
      };

      removeListener = () => {
        this.mapInstance.off('sourcedata', onSourceData);
      };
      this.mapInstance.on('sourcedata', onSourceData);
    });

    try {
      applyData();
    } catch (error) {
      removeListener();
      throw error;
    }

    try {
      await withPromiseTimeoutRace({
        promise: committed,
        errorMessage: `Source data commit for "${sourceId}"`,
        onTimeout: removeListener,
      });
    } catch (error) {
      log.error('MapboxSource.commitData: source did not report a commit', error);
    }
  }

  /**
   * @internal
   * Apply a hashed diff to a FeatureCollection, producing a new FeatureCollection.
   */
  private static applyDiff(
    collection: FeatureCollection,
    diff: GeoJSONSourceDiffHashed,
  ): FeatureCollection {
    let features: Feature[] = [...collection.features];

    if (diff.removeAll) {
      features = [];
    }

    if (diff.remove) {
      const removeIds = diff.remove;
      features = features.filter((f) => {
        const fid = f.properties?.[FEATURE_ID_PROPERTY];
        return fid === undefined || !removeIds.has(fid);
      });
    }

    if (diff.add) {
      for (const feature of diff.add.values()) {
        features.push(feature);
      }
    }

    if (diff.update) {
      for (const patch of diff.update.values()) {
        const idx = features.findIndex((f) => f.properties?.[FEATURE_ID_PROPERTY] === patch.id);
        if (idx === -1) continue;
        const feature = { ...features[idx] };

        if (patch.newGeometry) {
          feature.geometry = patch.newGeometry;
        }

        if (patch.removeAllProperties) {
          feature.properties = {};
        }

        if (patch.removeProperties) {
          feature.properties = { ...feature.properties };
          for (const key of patch.removeProperties) {
            delete feature.properties[key];
          }
        }

        if (patch.addOrUpdateProperties) {
          feature.properties = { ...feature.properties };
          for (const { key, value } of patch.addOrUpdateProperties) {
            feature.properties[key] = value;
          }
        }

        features[idx] = feature;
      }
    }

    return { type: 'FeatureCollection', features };
  }

  remove() {
    if (!this.isInstanceAvailable()) {
      return;
    }

    this.gm.mapAdapter.eachLayer((layer) => {
      if (layer.source === this.sourceInstance.id) {
        this.gm.mapAdapter.removeLayer(layer.id);
      }
    });

    this.mapInstance.removeSource(this.sourceInstance.id);
  }
}
