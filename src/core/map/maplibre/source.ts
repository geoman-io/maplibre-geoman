import { BaseSource } from '@/core/map/base/source.ts';
import {
  FEATURE_ID_PROPERTY,
  type GeoJsonShapeFeatureCollection,
  type GeoJsonUniversalDiff,
  type Geoman,
  SHAPE_NAMES,
  type ShapeName,
} from '@/main.ts';
import { withPromiseTimeoutRace } from '@/utils/behavior.ts';
import type { Feature, GeoJSON } from 'geojson';
import log from 'loglevel';
import ml from 'maplibre-gl';

export class MaplibreSource extends BaseSource<ml.GeoJSONSource> {
  gm: Geoman;
  mapInstance: ml.Map;
  sourceInstance: ml.GeoJSONSource | null;

  constructor({ gm, geoJson, sourceId }: { gm: Geoman; sourceId: string; geoJson?: GeoJSON }) {
    super();
    this.gm = gm;
    this.mapInstance = this.gm.mapAdapter.mapInstance as ml.Map;

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

  async waitForLoad() {
    const EVENT_NAME = 'idle';
    const updatesPending = this.gm.features.updateManager.updatesPending(this.id);

    const loadPromise = new Promise<void>((resolve) => {
      if (this.loaded && !updatesPending) {
        resolve();
        return;
      }

      const onData = () => {
        if (this.loaded) {
          this.mapInstance.off(EVENT_NAME, onData);
          resolve();
        }
      };

      this.mapInstance.on(EVENT_NAME, onData);
    });

    await withPromiseTimeoutRace(loadPromise, 'Unable to wait for source to load');
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

  async updateData(updateStorage: GeoJsonUniversalDiff) {
    if (!this.isInstanceAvailable()) {
      return;
    }

    const mlDiff = this.convertUniversalDiffToMlDiff(updateStorage);
    await this.sourceInstance.updateData(mlDiff, true);
  }

  convertUniversalDiffToMlDiff(diff: GeoJsonUniversalDiff): ml.GeoJSONSourceDiff {
    // todo: check possible performance issue here,
    // todo: feature properties updates applies geometry updates
    return {
      add: diff.add,
      update: diff.update?.map(this.convertFeatureToMlUpdateDiff.bind(this)),
      remove: diff.remove,
    };
  }

  convertFeatureToMlUpdateDiff(feature: Feature): ml.GeoJSONFeatureDiff {
    const addOrUpdateProperties: ml.GeoJSONFeatureDiff['addOrUpdateProperties'] = [];
    const removeProperties: ml.GeoJSONFeatureDiff['removeProperties'] = [];

    Object.entries(feature.properties || {}).forEach(([key, value]) => {
      if (value === undefined) {
        removeProperties.push(key);
      } else {
        addOrUpdateProperties.push({ key, value });
      }
    });

    return {
      id: feature.properties?.[FEATURE_ID_PROPERTY],
      newGeometry: feature.geometry,
      addOrUpdateProperties,
      removeProperties,
    };
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
