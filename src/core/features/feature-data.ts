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
  type GeoJSONFeatureDiff,
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
      this.addGeoJson(geoJson).then();
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
    this.removeProperties([`${FEATURE_PROPERTY_PREFIX}${name}`], false);
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

  async addGeoJson(geoJson: GeoJsonShapeFeature) {
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

    const add = new Map<FeatureId, Feature>().set(this.id, this._geoJson);
    await this.gm.features.updateManager.updateSource({
      diff: { add },
      sourceName: this.sourceName,
    });
  }

  async removeGeoJson() {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    await this.gm.features.updateManager.updateSource({
      diff: { remove: new Set([this.id]) },
      sourceName: this.sourceName,
    });
  }

  async removeMarkers() {
    await Promise.all(
      Array.from(this.markers.values(), (markerData) => {
        if (markerData.instance instanceof BaseDomMarker) {
          markerData.instance.remove(); // sync remove a dom marker
          return;
        } else {
          return this.gm.features.delete(markerData.instance);
        }
      }),
    );

    this.markers = new Map();
  }

  /**
   * Updates the geometry of this feature.
   *
   * @param geometry - The new geometry for the feature
   *
   * @example
   * // Update a marker's position
   * feature.updateGeometry({ type: 'Point', coordinates: [10, 52] });
   *
   * // Update a polygon's coordinates
   * feature.updateGeometry({
   *   type: 'Polygon',
   *   coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
   * });
   */
  async updateGeometry(geometry: BasicGeometry) {
    const featureGeoJson = this.getGeoJson();
    if (!featureGeoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this._geoJson = { ...featureGeoJson, geometry };

    const update = new Map<FeatureId, GeoJSONFeatureDiff>().set(this.id, {
      id: this.id,
      newGeometry: this._geoJson.geometry,
    });

    await this.gm.features.updateManager.updateSource({
      diff: { update },
      sourceName: this.sourceName,
    });
  }

  /**
   * Updates custom properties on this feature. Properties are merged with existing ones.
   *
   * Internal Geoman properties (prefixed with `gm_`) cannot be modified through this method
   * and will be preserved.
   *
   * @param properties - Object containing properties to update or delete (set to undefined)
   *
   * @example
   * // Add or update properties
   * feature.updateProperties({ color: 'red', size: 10 });
   *
   * // Delete a property
   * feature.updateProperties({ color: undefined });
   *
   * // Mix of updates and deletions
   * feature.updateProperties({ color: 'blue', oldProp: undefined });
   */
  async updateProperties(properties: Record<string, unknown>) {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    const nextProperties = { ...this._geoJson.properties };

    const featureDiff: GeoJSONFeatureDiff = {
      id: this.id,
      addOrUpdateProperties: [],
      removeProperties: [],
    };

    const mandatoryProperties = this.parseGmShapeProperties(this._geoJson);
    const protectedKeys = new Set(Object.keys(mandatoryProperties));

    for (const [key, value] of Object.entries(properties)) {
      if (protectedKeys.has(key)) {
        continue;
      }
      if (typeof value === 'undefined') {
        delete nextProperties[key];
        featureDiff.removeProperties?.push(key);
      } else {
        nextProperties[key] = value;
        featureDiff.addOrUpdateProperties?.push({ key, value });
      }
    }

    const update = new Map<FeatureId, GeoJSONFeatureDiff>().set(this.id, featureDiff);

    this._geoJson.properties = nextProperties;
    await this.gm.features.updateManager.updateSource({
      diff: { update },
      sourceName: this.sourceName,
    });
  }

  /**
   * Replaces all custom properties on this feature. Existing custom properties are removed
   * and replaced with the provided ones.
   *
   * Internal Geoman properties (prefixed with `gm_`) cannot be modified and will be preserved.
   *
   * @param properties - Object containing the new properties (replaces all existing custom properties)
   *
   * @example
   * // Replace all custom properties
   * feature.setProperties({ name: 'New Feature', category: 'poi' });
   */
  async setProperties(properties: Record<string, unknown>) {
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

    const add = new Map<FeatureId, Feature>().set(this.id, this._geoJson);

    await this.gm.features.updateManager.updateSource({
      diff: { add },
      sourceName: this.sourceName,
    });
  }

  async removeProperties(fieldNames: Array<string>, preserveInternals = true) {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    const deniedKeys = preserveInternals
      ? typedKeys(propertyValidators).map((fieldName) => `${FEATURE_PROPERTY_PREFIX}${fieldName}`)
      : [];

    const keysToRemove = fieldNames.filter((fieldName) => !deniedKeys.includes(fieldName));
    const nextProperties = { ...this._geoJson.properties };

    keysToRemove.forEach((key) => {
      delete nextProperties[key];
    });

    const update = new Map<FeatureId, GeoJSONFeatureDiff>().set(this.id, {
      id: this.id,
      removeProperties: keysToRemove,
      // issue with MapLibre 5.15 keep empty but present
      addOrUpdateProperties: [],
    });

    this._geoJson.properties = nextProperties;
    await this.gm.features.updateManager.updateSource({
      diff: { update },
      sourceName: this.sourceName,
    });
  }

  /**
   * Internal method to update all properties including Geoman system properties.
   * This should only be used by internal Geoman code (edit modes, draw modes, etc.).
   *
   * @internal
   * @param properties - Properties to merge with existing ones
   */
  async _updateAllProperties(properties: Partial<ShapeGeoJsonProperties>) {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this._geoJson.properties = { ...this._geoJson.properties, ...properties };

    const update = new Map<FeatureId, GeoJSONFeatureDiff>().set(this.id, {
      id: this.id,
      addOrUpdateProperties: Object.entries(properties || {}).map(([key, value]) => ({
        key,
        value,
      })),
    });

    await this.gm.features.updateManager.updateSource({
      diff: { update },
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

  async changeSource({ sourceName }: { sourceName: FeatureSourceName }) {
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

    await this.removeGeoJson();
    this.source = source;
    await this.addGeoJson(shapeGeoJson);

    if (this.markers.size) {
      await Promise.all(
        Array.from(this.markers.values(), (markerData) => {
          if (markerData.instance instanceof FeatureData) {
            return markerData.instance.changeSource({
              sourceName: sourceName === SOURCES.temporary ? SOURCES.temporary : SOURCES.internal,
            });
          }
        }),
      );
    }
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

  async delete() {
    await this.removeGeoJson();
    await this.removeMarkers();
  }
}
