import { BaseDomMarker } from '@/core/map/base/marker.ts';
import type { BaseSource } from '@/core/map/base/source.ts';
import {
  type BasicGeometry,
  FEATURE_ID_PROPERTY,
  type FeatureDataParameters,
  type FeatureId,
  type FeatureOrders,
  type FeatureShape,
  type FeatureShapeProperties,
  type FeatureSourceName,
  type GeoJsonShapeFeature,
  type Geoman,
  type LngLat,
  type MarkerData,
  type MarkerId,
  type ShapeGeoJsonProperties,
} from '@/main.ts';
import { exportShapeProperties } from '@/utils/features.ts';
import { geoJsonPointToLngLat } from '@/utils/geojson.ts';
import { typedValues } from '@/utils/typing.ts';
import centroid from '@turf/centroid';
import log from 'loglevel';
import { SOURCES } from '@/core/features/constants.ts';

export const conversionAllowedShapes: Array<FeatureData['shape']> = [
  'circle',
  'ellipse',
  'rectangle',
];

export class FeatureData {
  gm: Geoman;
  id: FeatureId = 'no-id';
  parent: FeatureData | null = null;
  shape: FeatureShape;
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
    this.shape = parameters.geoJsonShapeFeature.properties.shape;
    this.addGeoJson(parameters.geoJsonShapeFeature);
  }

  get temporary(): boolean {
    return (this.source.id as FeatureSourceName) === SOURCES.temporary;
  }

  get sourceName(): FeatureSourceName {
    return this.source.id as FeatureSourceName;
  }

  getEmptyOrders(): FeatureOrders {
    return Object.fromEntries(typedValues(SOURCES).map((name) => [name, null])) as FeatureOrders;
  }

  getShapeProperty(name: keyof FeatureShapeProperties) {
    return this.shapeProperties[name];
  }

  getShapeProperties() {
    return this.shapeProperties;
  }

  setShapeProperty<T extends keyof FeatureShapeProperties>(
    name: T,
    value: FeatureShapeProperties[T],
  ) {
    this.shapeProperties[name] = value;
  }

  getGeoJson(includeShapeProperties = false): GeoJsonShapeFeature {
    if (this._geoJson) {
      return includeShapeProperties
        ? {
            ...this._geoJson,
            properties: {
              ...this._geoJson.properties,
              ...exportShapeProperties(this),
            },
          }
        : this._geoJson;
    } else {
      throw new Error(`Missing GeoJSON for feature: "${this.shape}:${this.id}"`);
    }
  }

  getSourceGeoJson() {
    return this.source.getGeoJson();
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
    } else if (this.shape === 'ellipse' && geoJson.properties._gm_shape_center) {
      this.setShapeProperty('center', geoJson.properties._gm_shape_center as LngLat);
      this.setShapeProperty('xSemiAxis', geoJson.properties._gm_shape_xSemiAxis as number);
      this.setShapeProperty('ySemiAxis', geoJson.properties._gm_shape_ySemiAxis as number);
      this.setShapeProperty('angle', geoJson.properties._gm_shape_angle as number);

      /** we need to delete because they are used only when FeatureData is instanciated
       *
       * when featureData is translated
       * > src/modes/edit/base -> updateFeatureGeoJson
       *  temp properties._gm_shape_* properties are assignated
       * and only featureData.updateGeoJsonGeometry is called
       */
      delete geoJson.properties._gm_shape_center;
      delete geoJson.properties._gm_shape_xSemiAxis;
      delete geoJson.properties._gm_shape_ySemiAxis;
      delete geoJson.properties._gm_shape_angle;
    }
  }

  convertToPolygon(): boolean {
    if (this.isConvertableToPolygon()) {
      this.shape = 'polygon';
      this.shapeProperties.center = null;
      delete this.shapeProperties.angle;
      delete this.shapeProperties.xSemiAxis;
      delete this.shapeProperties.ySemiAxis;
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
