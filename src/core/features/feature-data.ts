import { FEATURE_PROPERTY_PREFIX, SOURCES } from '@/core/features/constants.ts';
import { BaseDomMarker } from '@/core/map/base/marker.ts';
import type { BaseSource } from '@/core/map/base/source.ts';
import {
  type BasicGeometry,
  FEATURE_ID_PROPERTY,
  type FeatureDataParameters,
  type FeatureId,
  type FeatureShape,
  type FeatureShapeProperties,
  type FeatureSourceName,
  type GeoJsonShapeFeature,
  type Geoman,
  includesWithType,
  type MarkerData,
  type MarkerId,
  type ShapeGeoJsonProperties,
  typedKeys,
} from '@/main.ts';
import { geoJsonPointToLngLat } from '@/utils/geojson.ts';
import centroid from '@turf/centroid';
import log from 'loglevel';
import { isLngLat } from '@/utils/guards/geojson.ts';
import { ALL_SHAPE_NAMES } from '@/modes/constants.ts';

export const conversionAllowedShapes: Array<FeatureData['shape']> = ['circle', 'rectangle'];

export class FeatureData {
  gm: Geoman;
  id: FeatureId = 'no-id';
  parent: FeatureData | null = null;
  shape: FeatureShape = 'marker';
  markers: Map<MarkerId, MarkerData>;
  shapeProperties: FeatureShapeProperties = { center: null };
  source: BaseSource;
  _geoJson: GeoJsonShapeFeature | null = null;

  constructor(parameters: FeatureDataParameters) {
    this.gm = parameters.gm;
    this.id = parameters.id;
    this.source = parameters.source;
    this.parent = parameters.parent;
    this.markers = new Map();
    this.parseGmShapeProperties(parameters.geoJsonShapeFeature);
    this.addGeoJson(parameters.geoJsonShapeFeature);
  }

  get temporary(): boolean {
    return (this.source.id as FeatureSourceName) === SOURCES.temporary;
  }

  get sourceName(): FeatureSourceName {
    return this.source.id as FeatureSourceName;
  }

  getShapeProperty(name: keyof FeatureShapeProperties) {
    return this.shapeProperties[name];
  }

  parseGmShapeProperties(geoJson: GeoJsonShapeFeature) {
    const shape =
      this.getGmShapeTypeProperty(geoJson) || this.gm.features.getFeatureShapeByGeoJson(geoJson);

    if (shape) {
      this.shape = shape;
    } else {
      log.error(`FeatureData.importGmShapeProperties(): unknown shape: ${shape}`);
    }

    const center = this.getGmCenterProperty(geoJson);
    if (center) {
      this.setShapeProperty('center', center);
    }
  }

  getGmShapeTypeProperty(geoJson: GeoJsonShapeFeature) {
    const value = geoJson.properties[`${FEATURE_PROPERTY_PREFIX}shape`] || geoJson.properties.shape;
    if (value && typeof value === 'string' && includesWithType(value, ALL_SHAPE_NAMES)) {
      return value;
    }
  }

  getGmCenterProperty(geoJson: GeoJsonShapeFeature) {
    const value =
      geoJson.properties[`${FEATURE_PROPERTY_PREFIX}center`] || geoJson.properties.center;
    if (isLngLat(value)) {
      return value;
    }
  }

  exportGmShapeProperties() {
    return Object.fromEntries(
      typedKeys(this.shapeProperties)
        .map((name) => [`${FEATURE_PROPERTY_PREFIX}${name}`, this.shapeProperties[name]])
        .filter(([, value]) => value !== undefined && value !== null),
    );
  }

  setShapeProperty<T extends keyof FeatureShapeProperties>(
    name: T,
    value: FeatureShapeProperties[T],
  ) {
    this.shapeProperties[name] = value;
  }

  getGeoJson(): GeoJsonShapeFeature {
    if (this._geoJson) {
      return this._geoJson;
    } else {
      throw new Error(`Missing GeoJSON for feature: "${this.shape}:${this.id}"`);
    }
  }

  addGeoJson(geoJson: GeoJsonShapeFeature) {
    if (this._geoJson) {
      throw new Error(`FeatureData.addGeoJson, not an empty feature: "${this.id}"`);
    }

    this._geoJson = {
      ...geoJson,
      properties: {
        ...geoJson.properties,
        [FEATURE_ID_PROPERTY]: this.id,
      },
    };

    this.updateGeoJsonCenter(this._geoJson);
    this.gm.features.updateManager.updateSource({
      diff: { add: [this._geoJson] },
      sourceName: this.sourceName,
    });
  }

  removeGeoJson() {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this.gm.features.updateManager.updateSource({
      diff: { remove: [this.id] },
      sourceName: this.sourceName,
    });
    this._geoJson = null;
  }

  removeMarkers() {
    this.markers.forEach((markerData) => {
      if (markerData.instance instanceof BaseDomMarker) {
        markerData.instance.remove();
      } else {
        this.gm.features.delete(markerData.instance);
      }
    });
    this.markers = new Map();
  }

  updateGeoJsonGeometry(geometry: BasicGeometry) {
    const featureGeoJson = this.getGeoJson();
    if (!featureGeoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this._geoJson = { ...featureGeoJson, geometry };

    const diff = {
      update: [this._geoJson],
    };
    this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });
  }

  updateGeoJsonProperties(properties: Partial<ShapeGeoJsonProperties>) {
    const featureGeoJson = this.getGeoJson();
    if (!featureGeoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this._geoJson = {
      ...featureGeoJson,
      properties: { ...featureGeoJson.properties, ...properties },
    };

    const diff = {
      update: [this._geoJson],
    };
    this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });
  }

  updateGeoJsonCenter(geoJson: GeoJsonShapeFeature) {
    if (this.shape === 'circle') {
      const shapeCentroid = geoJsonPointToLngLat(centroid(geoJson));
      this.setShapeProperty('center', shapeCentroid);
    }
  }

  convertToPolygon(): boolean {
    if (this.isConvertableToPolygon()) {
      this.shape = 'polygon';
      this.shapeProperties.center = null;
      return true;
    }

    return false;
  }

  isConvertableToPolygon(): boolean {
    return conversionAllowedShapes.includes(this.shape);
  }

  changeSource({ sourceName, atomic }: { sourceName: FeatureSourceName; atomic: boolean }) {
    if (atomic) {
      this.gm.features.updateManager.withAtomicSourcesUpdate(() =>
        this.actualChangeSource({ sourceName, atomic }),
      );
    } else {
      this.actualChangeSource({ sourceName, atomic });
    }
  }

  actualChangeSource({ sourceName, atomic }: { sourceName: FeatureSourceName; atomic: boolean }) {
    if (this.source.id === sourceName) {
      log.error(
        `FeatureData.changeSource: feature "${this.id}" already has the source "${sourceName}"`,
      );
      return;
    }

    const source = this.gm.features.sources[sourceName];
    if (!source) {
      log.error(`FeatureData.changeSource: missing source "${sourceName}"`);
      return;
    }

    const shapeGeoJson = this.getGeoJson();
    if (!shapeGeoJson) {
      log.error('FeatureData.changeSource: missing shape GeoJSON');
      return;
    }

    this.removeGeoJson();
    this.source = source;
    this.addGeoJson(shapeGeoJson);

    this.markers.forEach((markerData) => {
      if (markerData.instance instanceof FeatureData) {
        markerData.instance.changeSource({ sourceName, atomic });
      }
    });
  }

  delete() {
    this.removeGeoJson();
    this.removeMarkers();
  }
}
