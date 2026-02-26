import { BaseSource } from '@/core/map/base/source.ts';
import {
  FEATURE_ID_PROPERTY,
  type GeoJsonShapeFeatureCollection,
  type GeoJSONSourceDiffHashed,
  type Geoman,
  SHAPE_NAMES,
  type ShapeName,
} from '@/main.ts';
import type { MapInstanceWithGeoman } from '@/types/map/index.ts';
import type { Feature, FeatureCollection, GeoJSON } from 'geojson';
import log from 'loglevel';
import type { GeoJSONSource as MapboxGeoJSONSource, Map as MapboxMap } from 'mapbox-gl';

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
    this.sourceInstance.setData(geoJson);
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
    this.sourceInstance.setData(updated);
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
