import { BaseSource } from '@/core/map/base/source.ts';
import {
  FEATURE_ID_PROPERTY,
  type GeoJsonShapeFeatureCollection,
  type GeoJsonSourceDiff,
  type Geoman,
} from '@/main.ts';
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
    return !!this.sourceInstance?.loaded();
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

  setGeoJson(geoJson: GeoJSON) {
    if (!this.isInstanceAvailable()) {
      throw new Error('Source instance is not available');
    }
    return this.sourceInstance.setData(geoJson);
  }

  updateData(updateStorage: GeoJsonSourceDiff) {
    if (!this.isInstanceAvailable()) {
      return;
    }

    const mlDiff = this.convertGeoJsonDiffToMlDiff(updateStorage);
    log.debug(`mldiff for "${this.sourceInstance?.id}"`, mlDiff);
    this.sourceInstance.updateData(mlDiff);
  }

  convertGeoJsonDiffToMlDiff(diff: GeoJsonSourceDiff): ml.GeoJSONSourceDiff {
    // todo: check possible performance issue here,
    // todo: feature properties updates applies geometry updates
    return {
      add: diff.add,
      update: diff.update?.map(this.convertFeatureToMlUpdateDiff.bind(this)),
      remove: diff.remove,
    };
  }

  convertFeatureToMlUpdateDiff(feature: Feature): ml.GeoJSONFeatureDiff {
    const propertiesArray = Object.entries(feature.properties || {}).map((item) => ({
      key: item[0],
      value: item[1],
    }));

    return {
      id: feature.properties?.[FEATURE_ID_PROPERTY],
      newGeometry: feature.geometry,
      addOrUpdateProperties: propertiesArray,
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
