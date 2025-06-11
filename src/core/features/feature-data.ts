import { FEATURE_ID_PROPERTY, SOURCES } from '@/core/features/index.ts';
import { BaseDomMarker } from '@/core/map/base/marker.ts';
import type { BaseSource } from '@/core/map/base/source.ts';
import type {
  BasicGeometry,
  FeatureDataParameters,
  FeatureId,
  FeatureOrder,
  FeatureOrders,
  FeatureShape,
  FeatureShapeProperties,
  FeatureSourceName,
  GeoJsonShapeFeature,
  GeoJsonShapeFeatureWithGmProperties,
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

  constructor(parameters: FeatureDataParameters) {
    this.gm = parameters.gm;
    this.id = parameters.id;
    this.source = parameters.source;
    this.parent = parameters.parent;
    this.markers = new Map();
    this.shape = parameters.geoJsonShapeFeature.properties.shape;
    this.order = this.getFreeOrder();
    this.addGeoJson(parameters.geoJsonShapeFeature);
  }

  get order(): FeatureOrder {
    const sourceName = this.source.id as FeatureSourceName;

    if (this.orders[sourceName] !== null) {
      return this.orders[sourceName];
    }
    throw new Error(`Null order for feature id: ${this.id}`);
  }

  set order(order: FeatureOrder) {
    // Note: be careful, set source before working with order
    const sourceName = this.source.id as FeatureSourceName;
    this.orders[sourceName] = order;
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

  getFreeOrder() {
    // Note: order could be from regular or tmp source
    // be careful, set temporary and source before working with order
    return this.getSourceGeoJson().features.length;
  }

  getGeoJson() {
    if (!this.isFeatureAvailable()) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this.fixOrder();

    const geoJsonFeature = this.getSourceGeoJson().features[this.order] || null;
    if (this.id !== geoJsonFeature?.id) {
      log.error(`Feature not found: ${this.id} !== ${geoJsonFeature?.id}`, geoJsonFeature, this.getSourceGeoJson());
      throw new Error('Feature not found');
    }
    return geoJsonFeature as GeoJsonShapeFeatureWithGmProperties;
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

  getSourceGeoJson() {
    return this.source.getGeoJson();
  }

  addGeoJson(geoJson: GeoJsonShapeFeature) {
    if (!this.isFeatureAvailable()) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    const featureCollection = this.getSourceGeoJson();
    if (featureCollection.features[this.order]) {
      log.error('FeatureData.addGeoJson, not an empty feature', this.id, featureCollection);
    }

    const shapeGeoJson = {
      ...geoJson,
      id: this.id,
      properties: {
        ...geoJson.properties,
        [FEATURE_ID_PROPERTY]: this.id,
      },
    };
    featureCollection.features[this.order] = shapeGeoJson;

    this.updateGeoJsonCenter(shapeGeoJson);
    this.gm.features.updateSourceData({
      diff: { add: [shapeGeoJson] },
      sourceName: this.sourceName,
    });
  }

  removeGeoJson() {
    if (!this.isFeatureAvailable()) {
      throw new Error(`Feature not found: "${this.id}"`);
    }
    this.fixOrder();

    const featureCollection = this.getSourceGeoJson();
    delete featureCollection.features[this.order];
    this.gm.features.updateSourceData({
      diff: { remove: [this.id] },
      sourceName: this.sourceName,
    });

    (this as { order: FeatureOrder }).order = null;
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
    if (!this.isFeatureAvailable()) {
      throw new Error(`Feature not found: "${this.id}"`);
    }
    this.fixOrder();

    const fcGeoJson = this.getSourceGeoJson();
    fcGeoJson.features[this.order].geometry = geometry;

    const diff = {
      update: [
        fcGeoJson.features[this.order],
      ],
    };
    this.gm.features.updateSourceData({
      diff,
      sourceName: this.sourceName,
    });
  }

  updateGeoJsonProperties(properties: ShapeGeoJsonProperties) {
    if (!this.isFeatureAvailable()) {
      throw new Error(`Feature not found: "${this.id}"`);
    }
    this.fixOrder();

    const fcGeoJson = this.getSourceGeoJson();
    fcGeoJson.features[this.order].properties = {
      ...fcGeoJson.features[this.order].properties,
      ...properties,
    };

    const diff = {
      update: [
        fcGeoJson.features[this.order],
      ],
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

  fixOrder() {
    if (!this.isFeatureAvailable()) {
      throw new Error(`Feature not found: "${this.id}"`);
    }
  }

  isFeatureAvailable(): this is { order: number } {
    return this.order !== null;
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
    this.removeGeoJson();
    this.source = source;
    this.order = this.getFreeOrder();
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
