import { BaseSource } from '@/core/map/base/source.ts';
import {
  FEATURE_ID_PROPERTY,
  type GeoJsonShapeFeatureCollection,
  type GeoJSONSourceDiffHashed,
  type Geoman,
  SHAPE_NAMES,
  type ShapeName,
} from '@/main.ts';
import type { GeoJSON } from 'geojson';
import log from 'loglevel';
import type { MapInstanceWithGeoman } from '@/types/map/index.ts';
import ml, { type GeoJSONSourceDiff } from 'maplibre-gl';

export class MaplibreSource extends BaseSource<ml.GeoJSONSource> {
  gm: Geoman;
  mapInstance: ml.Map;
  sourceInstance: ml.GeoJSONSource | null;

  constructor({ gm, geoJson, sourceId }: { gm: Geoman; sourceId: string; geoJson?: GeoJSON }) {
    super();
    this.gm = gm;
    this.mapInstance = this.gm.mapAdapter.getMapInstance() as MapInstanceWithGeoman<ml.Map>;

    if (geoJson) {
      this.sourceInstance = this.createSource({ geoJson, sourceId });
    } else {
      this.sourceInstance = (this.mapInstance.getSource(sourceId) as ml.GeoJSONSource) || null;
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

  createSource({ geoJson, sourceId }: { sourceId: string; geoJson: GeoJSON }): ml.GeoJSONSource {
    let source = this.mapInstance.getSource(sourceId) as ml.GeoJSONSource | undefined;
    if (source) {
      log.warn(`Source "${source.id}" already exists, skipping`);
    } else {
      this.mapInstance.addSource(sourceId, {
        type: 'geojson',
        data: geoJson,
        promoteId: FEATURE_ID_PROPERTY,
      });
      source = this.mapInstance.getSource(sourceId) as ml.GeoJSONSource;
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
    await this.sourceInstance.setData(geoJson, true);
  }

  async updateData(hashedDiff: GeoJSONSourceDiffHashed) {
    if (!this.isInstanceAvailable()) {
      return;
    }
    const mlDiff = MaplibreSource.hashedToDiff(hashedDiff);

    await this.sourceInstance.updateData(mlDiff, true);
  }

  /**
   * @internal
   * Convert a hashed GeoJSONSourceDiff back to the array-based representation
   */
  private static hashedToDiff(hashed: GeoJSONSourceDiffHashed): GeoJSONSourceDiff {
    const diff: GeoJSONSourceDiff = {};

    if (hashed.removeAll) {
      diff.removeAll = hashed.removeAll;
    }
    if (hashed.remove) {
      diff.remove = Array.from(hashed.remove);
    }
    if (hashed.add) {
      diff.add = Array.from(hashed.add.values());
    }
    if (hashed.update) {
      diff.update = Array.from(hashed.update.values());
    }

    return diff;
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
