import { BaseSource } from '@/core/map/base/source.ts';
import {
  FEATURE_ID_PROPERTY,
  type GeoJsonDiffStorage,
  type GeoJsonShapeFeatureCollection,
  type Geoman,
} from '@/main.ts';
import type { Feature, GeoJSON } from 'geojson';
import ml from 'maplibre-gl';
import log from 'loglevel';
import { mergeGeoJsonDiff } from './helper.ts';


export class MaplibreSource extends BaseSource<ml.GeoJSONSource> {
  gm: Geoman;
  mapInstance: ml.Map;
  sourceInstance: ml.GeoJSONSource | null;

  pendingUpdateStorage: GeoJsonDiffStorage | null = null;
  mlSourceDiff: ml.GeoJSONSourceDiff | null = null
  updateTimeout: null | number = null;


  constructor({ gm, geoJson, sourceId }: {
    gm: Geoman,
    sourceId: string,
    geoJson?: GeoJSON,
  }) {
    super();
    this.gm = gm;
    this.mapInstance = this.gm.mapAdapter.mapInstance as ml.Map;

    if (geoJson) {
      this.sourceInstance = this.createSource({ geoJson, sourceId });
    } else {
      this.sourceInstance = this.mapInstance.getSource(sourceId) as ml.GeoJSONSource || null;
    }
  }

  get id(): string {
    if (!this.isInstanceAvailable()) {
      throw new Error('Source instance is not available');
    }

    return this.sourceInstance.id;
  }

  createSource(
    { geoJson, sourceId }: { sourceId: string, geoJson: GeoJSON },
  ): ml.GeoJSONSource {
    let source = this.mapInstance.getSource(sourceId) as ml.GeoJSONSource | undefined;
    if (source) {
      log.warn(`Source "${source.id}" already exists, skipping`);
    } else {
      this.mapInstance.addSource(sourceId, {
        type: 'geojson',
        data: geoJson,
        promoteId: FEATURE_ID_PROPERTY,
      });
      source = this.mapInstance.getSource(sourceId) as ml.GeoJSONSource
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

  updateData = (updateStorage?: GeoJsonDiffStorage) => {
    if (!this.isInstanceAvailable()) {
      return;
    }

    const fullUpdateStorage = mergeGeoJsonDiff(this.pendingUpdateStorage, updateStorage ?? null)

    if (this.updateTimeout) {
      window.clearTimeout(this.updateTimeout)
      this.updateTimeout = null;
    }

    if (this.sourceInstance._pendingLoads === 0) {
      this.pendingUpdateStorage = null;
      const mlDiff = this.convertGeoJsonDiffToMlDiff(fullUpdateStorage);

      this.sourceInstance.updateData(mlDiff);
    } else {
      this.pendingUpdateStorage = fullUpdateStorage;
      this.updateTimeout = window.setTimeout(this.updateData, 15)
    }
  }

  convertGeoJsonDiffToMlDiff(
    diff: GeoJsonDiffStorage,
  ): ml.GeoJSONSourceDiff {
    // todo: check possible performance issue here,
    // todo: feature properties updates applies geometry updates
    return {
      add: diff.add,
      update: diff.update.map(this.convertFeatureToMlUpdateDiff.bind(this)),
      remove: diff.remove,
    };
  }

  convertFeatureToMlUpdateDiff(feature: Feature): ml.GeoJSONFeatureDiff {
    const propertiesArray = Object
      .entries(feature.properties || {})
      .map((item) => ({ key: item[0], value: item[1] }));

    return {
      id: feature.id as string,
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
