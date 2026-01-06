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
import { cloneDeep } from 'lodash-es';
import log from 'loglevel';

export const toPolygonAllowedShapes: Array<FeatureData['shape']> = [
  'circle',
  'ellipse',
  'rectangle',
];

export class FeatureData {
  gm: Geoman;
  id: FeatureId = 'no-id';
  parent: FeatureData | null = null;
  markers: Map<MarkerId, MarkerData>;
  source: BaseSource;
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

  setShapeProperty<T extends keyof FeatureShapeProperties>(
    name: T,
    value: ShapeGeoJsonProperties[`${typeof FEATURE_PROPERTY_PREFIX}${T}`],
  ) {
    if (!this._geoJson) {
      log.error(`FeatureData.setShapeProperty(): geojson is not set`);
      return;
    }
    this._geoJson.properties[`${FEATURE_PROPERTY_PREFIX}${name}`] = value;
    this._updateAllProperties(this._geoJson.properties);
  }

  deleteShapeProperty<T extends keyof FeatureShapeProperties>(name: T) {
    if (!this._geoJson) {
      log.error(`FeatureData.deleteShapeProperty(): geojson is not set`);
      return;
    }
    delete this._geoJson.properties[`${FEATURE_PROPERTY_PREFIX}${name}`];
    this._updateAllProperties(this._geoJson.properties);
  }

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

  /**
   * Add a GeoJSON feature to the source.
   *
   * Returns a Promise that resolves when MapLibre has committed the data.
   * The internal feature state is updated synchronously before the Promise.
   *
   * @param geoJson - The GeoJSON feature to add
   * @returns Promise that resolves when the data is committed to MapLibre
   */
  addGeoJson(geoJson: GeoJsonShapeFeature): Promise<void> {
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

    return this.gm.features.updateManager.updateSource({
      diff: { add: [this._geoJson] },
      sourceName: this.sourceName,
    });
  }

  /**
   * Remove the GeoJSON feature from the source.
   *
   * Returns a Promise that resolves when MapLibre has committed the removal.
   *
   * @returns Promise that resolves when the data is committed to MapLibre
   */
  removeGeoJson(): Promise<void> {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    return this.gm.features.updateManager.updateSource({
      diff: { remove: [this.id] },
      sourceName: this.sourceName,
    });
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

  /**
   * Updates the geometry of this feature.
   *
   * Returns a Promise that resolves when MapLibre has committed the data.
   * The internal feature state is updated synchronously before the Promise.
   *
   * @param geometry - The new geometry for the feature
   * @returns Promise that resolves when the data is committed to MapLibre
   *
   * @example
   * // Update a marker's position
   * await feature.updateGeometry({ type: 'Point', coordinates: [10, 52] });
   *
   * // Update a polygon's coordinates
   * await feature.updateGeometry({
   *   type: 'Polygon',
   *   coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
   * });
   */
  updateGeometry(geometry: BasicGeometry): Promise<void> {
    const featureGeoJson = this.getGeoJson();
    if (!featureGeoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this._geoJson = { ...featureGeoJson, geometry };

    const diff = {
      update: [this._geoJson],
    };
    return this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });
  }

  /**
   * Updates custom properties on this feature. Properties are merged with existing ones.
   * Set a property value to `undefined` to delete it.
   *
   * Internal Geoman properties (prefixed with `gm_`) cannot be modified through this method
   * and will be preserved.
   *
   * Returns a Promise that resolves when MapLibre has committed the data.
   * The internal feature state is updated synchronously before the Promise.
   *
   * @param properties - Object containing properties to update or delete (set to undefined)
   * @returns Promise that resolves when the data is committed to MapLibre
   *
   * @example
   * // Add or update properties
   * await feature.updateProperties({ color: 'red', size: 10 });
   *
   * // Delete a property
   * await feature.updateProperties({ color: undefined });
   *
   * // Mix of updates and deletions
   * await feature.updateProperties({ color: 'blue', oldProp: undefined });
   */
  updateProperties(properties: Record<string, unknown>): Promise<void> {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    const mandatoryProperties = this.parseGmShapeProperties(this._geoJson);
    const protectedKeys = new Set(Object.keys(mandatoryProperties));

    // Build new properties: start with existing, apply updates (respecting undefined as delete)
    const newProperties: Record<string, unknown> = {};

    // Copy existing properties (excluding ones being deleted)
    for (const [key, value] of Object.entries(this._geoJson.properties)) {
      if (key in properties) {
        // This key is being updated - will be handled below
        continue;
      }
      newProperties[key] = value;
    }

    // Apply updates (skip protected keys, handle undefined as delete signal)
    for (const [key, value] of Object.entries(properties)) {
      if (protectedKeys.has(key)) {
        // Skip protected gm_ properties
        continue;
      }
      if (value !== undefined) {
        newProperties[key] = value;
      }
      // If value is undefined, we simply don't add it (deletion)
    }

    // Always preserve mandatory properties
    Object.assign(newProperties, mandatoryProperties);

    // Update internal state (without undefined markers)
    this._geoJson.properties = newProperties as ShapeGeoJsonProperties;

    // Build diff properties with undefined markers for MapLibre's removeProperties
    const diffProperties: Record<string, unknown> = { ...newProperties };
    for (const [key, value] of Object.entries(properties)) {
      if (protectedKeys.has(key)) continue;
      if (value === undefined) {
        diffProperties[key] = undefined; // Signal to MapLibre to remove this property
      }
    }

    const diff = { update: [{ ...this._geoJson, properties: diffProperties }] };
    return this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });
  }

  /**
   * Replaces all custom properties on this feature. Existing custom properties are removed
   * and replaced with the provided ones.
   *
   * Internal Geoman properties (prefixed with `gm_`) cannot be modified and will be preserved.
   *
   * Returns a Promise that resolves when MapLibre has committed the data.
   * The internal feature state is updated synchronously before the Promise.
   *
   * @param properties - Object containing the new properties (replaces all existing custom properties)
   * @returns Promise that resolves when the data is committed to MapLibre
   *
   * @example
   * // Replace all custom properties
   * await feature.setProperties({ name: 'New Feature', category: 'poi' });
   */
  setProperties(properties: Record<string, unknown>): Promise<void> {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    const mandatoryProperties = this.parseGmShapeProperties(this._geoJson);

    // Filter out undefined values and protected keys from input
    const filteredProperties: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(properties)) {
      if (value !== undefined && !(key in mandatoryProperties)) {
        filteredProperties[key] = value;
      }
    }

    this._geoJson.properties = {
      ...filteredProperties,
      ...mandatoryProperties,
    } as ShapeGeoJsonProperties;

    const diff = { update: [this._geoJson] };
    return this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });
  }

  /**
   * Internal method to update all properties including Geoman system properties.
   * This should only be used by internal Geoman code (edit modes, draw modes, etc.).
   *
   * Returns a Promise that resolves when MapLibre has committed the data.
   * The internal feature state is updated synchronously before the Promise.
   *
   * @internal
   * @param properties - Properties to merge with existing ones
   * @returns Promise that resolves when the data is committed to MapLibre
   */
  _updateAllProperties(properties: Partial<ShapeGeoJsonProperties>): Promise<void> {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this._geoJson.properties = { ...this._geoJson.properties, ...properties };
    const diff = { update: [this._geoJson] };

    return this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });
  }

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

  isConvertableToPolygon(): boolean {
    return toPolygonAllowedShapes.includes(this.shape);
  }

  /**
   * Move this feature to a different source.
   *
   * Returns a Promise that resolves when MapLibre has committed the source change.
   * Internal state is updated synchronously before the Promise.
   * Internal callers can ignore the Promise for fire-and-forget behavior.
   *
   * @param sourceName - The target source name
   * @param atomic - Whether to batch the remove/add operations (currently unused)
   * @returns Promise that resolves when the data is committed to MapLibre
   */
  changeSource({
    sourceName,
    atomic,
  }: {
    sourceName: FeatureSourceName;
    atomic: boolean;
  }): Promise<void> {
    if (this.source.id === sourceName) {
      log.error(
        `FeatureData.changeSource: feature "${this.id}" already has the source "${sourceName}"`,
      );
      return Promise.resolve();
    }

    const source = this.gm.features.sources[sourceName];
    if (!source) {
      log.error(`FeatureData.changeSource: missing source "${sourceName}"`);
      return Promise.resolve();
    }

    const shapeGeoJson = this.getGeoJson();
    if (!shapeGeoJson) {
      log.error('FeatureData.changeSource: missing shape GeoJSON');
      return Promise.resolve();
    }

    // Fire-and-forget internally - internal state is updated synchronously
    const removePromise = this.removeGeoJson();
    this.source = source;
    const addPromise = this.addGeoJson(shapeGeoJson);

    // Collect marker promises (also fire-and-forget)
    const markerPromises: Promise<void>[] = [];
    this.markers.forEach((markerData) => {
      if (markerData.instance instanceof FeatureData) {
        markerPromises.push(markerData.instance.changeSource({ sourceName, atomic }));
      }
    });

    // Return combined promise for users who want to await
    return Promise.all([removePromise, addPromise, ...markerPromises]).then(() => {});
  }

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

  /**
   * Delete this feature from its source and remove all markers.
   *
   * Returns a Promise that resolves when MapLibre has committed the removal.
   * Internal callers can ignore the Promise for fire-and-forget behavior.
   *
   * @returns Promise that resolves when the data is committed to MapLibre
   */
  delete(): Promise<void> {
    const promise = this.removeGeoJson();
    this.removeMarkers();
    return promise;
  }
}
