import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { FEATURE_PROPERTY_PREFIX, SOURCES } from '@/core/features/constants.ts';
import { propertyValidators } from '@/core/features/validators.ts';
import { BaseDomMarker } from '@/core/map/base/marker.ts';
import type { BaseSource } from '@/core/map/base/source.ts';
import {
  type BasicGeometry,
  type EditModeName,
  type FeatureDataParameters,
  type FeatureId,
  type FeatureShape,
  type FeatureShapeProperties,
  type FeatureSourceName,
  type GeoJsonShapeFeature,
  type Geoman,
  type GmEditFeatureUpdatedEvent,
  includesWithType,
  type MarkerData,
  type MarkerId,
  type PrefixedFeatureShapeProperties,
  type ShapeGeoJsonProperties,
  typedKeys,
} from '@/main.ts';
import { ALL_SHAPE_NAMES } from '@/modes/constants.ts';
import { geoJsonPointToLngLat } from '@/utils/geojson.ts';
import centroid from '@turf/centroid';
import type { Feature } from 'geojson';
import { cloneDeep } from 'lodash-es';
import log from 'loglevel';

/** @internal */
export const toPolygonAllowedShapes: Array<FeatureData['shape']> = [
  'circle',
  'ellipse',
  'rectangle',
];

export class FeatureData {
  /** @internal */
  gm: Geoman;
  id: FeatureId = 'no-id';
  /** @internal */
  parent: FeatureData | null = null;
  /** @internal */
  markers: Map<MarkerId, MarkerData>;
  /** @internal */
  source: BaseSource;
  /** @internal */
  _geoJson: GeoJsonShapeFeature | null = null;

  constructor(parameters: FeatureDataParameters) {
    this.gm = parameters.gm;
    this.id = parameters.id;
    this.source = parameters.source;
    this.parent = parameters.parent;
    this.markers = new Map();

    const geoJson = {
      ...parameters.geoJsonShapeFeature,
      properties: {
        ...this.parseExtraProperties(parameters.geoJsonShapeFeature),
        ...this.parseGmShapeProperties(parameters.geoJsonShapeFeature),
      },
    };

    if (parameters.skipSourceUpdate) {
      // When hydrating from existing source, just set the internal GeoJSON
      // without adding to the source (feature already exists there)
      this._geoJson = {
        ...geoJson,
        id: this.id,
      };
      // For circles, ensure center property is set (but don't queue an update
      // since the feature already exists in the source)
      if (this.shape === 'circle') {
        const shapeCentroid = geoJsonPointToLngLat(centroid(this._geoJson));
        this._geoJson.properties[`${FEATURE_PROPERTY_PREFIX}center`] = shapeCentroid;
      }
    } else {
      this.addGeoJson(geoJson);
    }
  }

  get shape(): FeatureShape {
    const value = this.getShapeProperty('shape');
    if (typeof value === 'string' && includesWithType(value, ALL_SHAPE_NAMES)) {
      return value;
    }
    throw new Error(`Wrong shape type: "${value}"`);
  }

  /** @internal */
  set shape(shape: FeatureShape) {
    this.setShapeProperty('shape', shape);
  }

  get temporary(): boolean {
    return (this.source.id as FeatureSourceName) === SOURCES.temporary;
  }

  get sourceName(): FeatureSourceName {
    return this.source.id as FeatureSourceName;
  }

  getShapeProperty<T extends keyof FeatureShapeProperties>(
    name: T,
    inputGeoJson?: GeoJsonShapeFeature,
  ): FeatureShapeProperties[T] | undefined {
    const geoJsonProperties = inputGeoJson?.properties || this._geoJson?.properties || {};
    const validator = propertyValidators[name];
    const value = geoJsonProperties[`${FEATURE_PROPERTY_PREFIX}${name}`] ?? geoJsonProperties[name];

    if (validator && validator(value)) {
      return value;
    }

    return undefined;
  }

  /** @internal */
  setShapeProperty<T extends keyof FeatureShapeProperties>(
    name: T,
    value: ShapeGeoJsonProperties[`${typeof FEATURE_PROPERTY_PREFIX}${T}`],
  ) {
    if (!this._geoJson) {
      log.error(`FeatureData.setShapeProperty(): geojson is not set`);
      return;
    }
    this._geoJson.properties[`${FEATURE_PROPERTY_PREFIX}${name}`] = value;
    this.updateGeoJsonInternalProperties(this._geoJson.properties);
  }

  /** @internal */
  deleteShapeProperty<T extends keyof FeatureShapeProperties>(name: T) {
    if (!this._geoJson) {
      log.error(`FeatureData.deleteShapeProperty(): geojson is not set`);
      return;
    }
    delete this._geoJson.properties[`${FEATURE_PROPERTY_PREFIX}${name}`];
    this.updateGeoJsonInternalProperties(this._geoJson.properties);
  }

  /** @internal */
  parseGmShapeProperties(geoJson: GeoJsonShapeFeature): PrefixedFeatureShapeProperties {
    const shape =
      this.getShapeProperty('shape', geoJson) || this.gm.features.getFeatureShapeByGeoJson(geoJson);

    if (!shape) {
      log.error(`FeatureData.importGmShapeProperties(): unknown shape: ${shape}`);
    }

    const allProperties: FeatureShapeProperties = Object.fromEntries(
      typedKeys(propertyValidators).map((name) => [name, this.getShapeProperty(name, geoJson)]),
    );

    const properties: FeatureShapeProperties = {
      ...allProperties,
      id: this.id,
      shape: shape || undefined,
    };

    return Object.fromEntries(
      typedKeys(properties)
        .filter((fieldName) => properties[fieldName] !== undefined)
        .map((fieldName) => [`${FEATURE_PROPERTY_PREFIX}${fieldName}`, properties[fieldName]]),
    );
  }

  /** @internal */
  parseExtraProperties(geoJson: GeoJsonShapeFeature) {
    const extraProperties = cloneDeep(geoJson.properties) || {};
    typedKeys(propertyValidators).forEach((name) => {
      delete extraProperties[name];
      delete extraProperties[`${FEATURE_PROPERTY_PREFIX}${name}`];
    });
    return extraProperties;
  }

  getGeoJson(): GeoJsonShapeFeature {
    if (this._geoJson) {
      return this._geoJson;
    } else {
      throw new Error(`Missing GeoJSON for feature: "${this.shape}:${this.id}"`);
    }
  }

  /** @internal */
  addGeoJson(geoJson: GeoJsonShapeFeature) {
    this._geoJson = {
      ...geoJson,
      id: this.id,
    };
    // For circles, calculate and set center property directly on _geoJson
    // before adding to source. We must not call setShapeProperty here because
    // it would queue an update diff before the add diff, causing MapLibre
    // to receive an update for a non-existent feature.
    if (this.shape === 'circle') {
      const shapeCentroid = geoJsonPointToLngLat(centroid(this._geoJson));
      this._geoJson.properties[`${FEATURE_PROPERTY_PREFIX}center`] = shapeCentroid;
    }

    this.gm.features.updateManager.updateSource({
      diff: { add: [this._geoJson] },
      sourceName: this.sourceName,
    });
  }

  /** @internal */
  removeGeoJson() {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this.gm.features.updateManager.updateSource({
      diff: { remove: [this.id] },
      sourceName: this.sourceName,
    });
  }

  /** @internal */
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

  /**
   * Updates the geometry of the feature.
   * Use this to programmatically move or reshape features.
   */
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

  /**
   * Updates the raw GeoJSON properties including internal shape properties.
   * Used internally by setShapeProperty and deleteShapeProperty.
   * @internal
   */
  updateGeoJsonInternalProperties(properties: Partial<ShapeGeoJsonProperties>) {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this._geoJson.properties = { ...this._geoJson.properties, ...properties };
    const diff = { update: [this._geoJson] };

    this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });
  }

  /**
   * Updates user-defined properties on the feature while preserving internal shape properties.
   * Use this to add or modify custom metadata on features.
   */
  updateGeoJsonProperties(properties: Feature['properties']) {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    const mandatoryProperties = this.parseGmShapeProperties(this._geoJson);

    this._geoJson.properties = {
      ...this._geoJson.properties,
      ...properties,
      ...mandatoryProperties,
    };

    const diff = { update: [this._geoJson] };
    this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });
  }

  /**
   * Deletes user-defined properties from the feature.
   * Internal shape properties (prefixed with __gm_) cannot be deleted.
   */
  deleteGeoJsonProperties(fieldNames: Array<string>) {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    const deniedKeys = typedKeys(propertyValidators).map(
      (fieldName) => `${FEATURE_PROPERTY_PREFIX}${fieldName}`,
    );

    const keysToDelete = fieldNames.filter((fieldName) => !deniedKeys.includes(fieldName));
    const newProperties = { ...this._geoJson.properties };

    keysToDelete.forEach((key) => {
      delete this._geoJson!.properties[key];
      newProperties[key] = undefined;
    });

    const diff = { update: [{ ...this._geoJson, properties: newProperties }] };
    this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });
  }

  /** @internal */
  convertToPolygon(): boolean {
    if (this.isConvertableToPolygon()) {
      this.shape = 'polygon';
      this.deleteShapeProperty('center');
      this.deleteShapeProperty('angle');
      this.deleteShapeProperty('xSemiAxis');
      this.deleteShapeProperty('ySemiAxis');
      return true;
    }

    return false;
  }

  /** @internal */
  isConvertableToPolygon(): boolean {
    return toPolygonAllowedShapes.includes(this.shape);
  }

  /** @internal */
  changeSource({ sourceName, atomic }: { sourceName: FeatureSourceName; atomic: boolean }) {
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

  /** @internal */
  fireFeatureUpdatedEvent({ mode }: { mode: EditModeName }) {
    const payload: GmEditFeatureUpdatedEvent = {
      name: `${GM_SYSTEM_PREFIX}:edit:feature_updated`,
      level: 'system',
      actionType: 'edit',
      action: 'feature_updated',
      mode,
      sourceFeatures: [this],
      targetFeatures: [this],
      markerData: null,
    };

    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:edit`, payload);
  }

  /** @internal */
  delete() {
    this.removeGeoJson();
    this.removeMarkers();
  }
}
