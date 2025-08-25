import { FEATURE_ID_PROPERTY, SOURCES } from '@/core/features/index.ts';
import { BaseDomMarker } from '@/core/map/base/marker.ts';
import type { BaseSource } from '@/core/map/base/source.ts';
import type {
  BasicGeometry,
  FeatureDataParameters,
  FeatureId,
  FeatureOrders,
  FeatureShape,
  FeatureShapeProperties,
  FeatureSourceName,
  GeoJsonShapeFeature,
  Geoman,
  MarkerData,
  MarkerId,
  ShapeGeoJsonProperties,
} from '@/main.ts';
import { geoJsonPointToLngLat } from '@/utils/geojson.ts';
import { typedValues } from '@/utils/typing.ts';
import centroid from '@turf/centroid';
import log from 'loglevel';


export const conversionAllowedShapes: Array<FeatureData['shape']> = ['circle', 'rectangle'];

export class FeatureData {
  gm: Geoman;
  id: FeatureId = 'no-id';
  parent: FeatureData | null = null;
  shape: FeatureShape;
  markers: Map<MarkerId, MarkerData>;
  shapeProperties: FeatureShapeProperties = { center: null };
  source: BaseSource;
  orders: FeatureOrders = this.getEmptyOrders();
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

  getEmptyOrders(): FeatureOrders {
    return Object.fromEntries(
      typedValues(SOURCES).map((name) => [name, null]),
    ) as FeatureOrders;
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

  getSourceGeoJson() {
    return this.source.getGeoJson();
  }

  addGeoJson(geoJson: GeoJsonShapeFeature) {
    if (this._geoJson) {
      throw new Error(`FeatureData.addGeoJson, not an empty feature: "${this.id}"`);
    }

    this._geoJson = {
      ...geoJson,
      id: this.id,
      properties: {
        ...geoJson.properties,
        [FEATURE_ID_PROPERTY]: this.id,
      },
    };

    this.updateGeoJsonCenter(this._geoJson);
    this.gm.features.updateSourceData({
      diff: { add: [this._geoJson] },
      sourceName: this.sourceName,
    });
  }

  removeGeoJson() {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this.gm.features.updateSourceData({
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
    this.gm.features.updateSourceData({
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
    this.gm.features.updateSourceData({
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

  changeSource({ sourceName, atomic }: {
    sourceName: FeatureSourceName,
    atomic: boolean,
  }) {
    if (atomic) {
      this.gm.features.withAtomicSourcesUpdate(
        () => this.actualChangeSource({ sourceName, atomic }),
      );
    } else {
      this.actualChangeSource({ sourceName, atomic });
    }
  }

  actualChangeSource({ sourceName, atomic }: {
    sourceName: FeatureSourceName,
    atomic: boolean,
  }) {
    if (this.source.id === sourceName) {
      log.error(`FeatureData.changeSource: feature "${this.id}" already has the source "${sourceName}"`);
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

    this.id = 'no-id';
    this.orders = this.getEmptyOrders();
  }
}
