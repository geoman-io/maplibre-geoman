import { BaseSource } from '@/core/map/base/source.ts';
import {
  FEATURE_ID_PROPERTY,
  type GeoJsonDiffStorage,
  type GeoJsonShapeFeatureCollection,
  type Geoman,
} from '@/main.ts';
import type { Feature, GeoJSON } from 'geojson';
import ml from 'maplibre-gl';


export class MaplibreSource extends BaseSource<ml.GeoJSONSource> {
  gm: Geoman;
  mapInstance: ml.Map;
  sourceInstance: ml.GeoJSONSource | null;

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
    if (!source) {
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

  updateData(updateStorage: GeoJsonDiffStorage) {
    if (!this.isInstanceAvailable()) {
      return;
    }

    const mlDiff = this.convertGeoJsonDiffToMlDiff(updateStorage);
    this.sourceInstance.updateData(mlDiff);
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

  remove({ removeLayers }: { removeLayers: boolean }) {
    if (!this.isInstanceAvailable()) {
      return;
    }

    if (removeLayers) {
      this.gm.mapAdapter.eachLayer((layer) => {
        if (layer.source === this.sourceInstance.id) {
          this.gm.mapAdapter.removeLayer(layer.id);
        }
      });
    }
    this.mapInstance.removeSource(this.sourceInstance.id);
  }
}
