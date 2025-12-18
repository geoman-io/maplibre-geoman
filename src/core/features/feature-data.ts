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
      this.updateGeoJsonCenter(this._geoJson);
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
    this.updateGeoJsonProperties(this._geoJson.properties);
  }

  deleteShapeProperty<T extends keyof FeatureShapeProperties>(name: T) {
    if (!this._geoJson) {
      log.error(`FeatureData.deleteShapeProperty(): geojson is not set`);
      return;
    }
    delete this._geoJson.properties[`${FEATURE_PROPERTY_PREFIX}${name}`];
    this.updateGeoJsonProperties(this._geoJson.properties);
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

  addGeoJson(geoJson: GeoJsonShapeFeature) {
    this._geoJson = {
      ...geoJson,
      id: this.id,
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

  /**
   * Update properties on the feature's GeoJSON.
   *
   * Returns a Promise that resolves when the update is committed to MapLibre.
   * You can await this if you need to read from the source immediately after.
   *
   * @example
   * ```typescript
   * // Fire-and-forget (existing behavior still works)
   * e.feature.updateGeoJsonProperties({ myProp: 'value' });
   *
   * // Or await to ensure data is committed before reading
   * await e.feature.updateGeoJsonProperties({ myProp: 'value' });
   * console.log(e.feature.source.getGeoJson()); // Will include the update
   * ```
   */
  updateGeoJsonProperties(properties: Partial<ShapeGeoJsonProperties>): Promise<void> {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    this._geoJson.properties = { ...this._geoJson.properties, ...properties };
    const diff = { update: [this._geoJson] };

    this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });

    return this.sync();
  }

  /**
   * Replace all custom properties on the feature's GeoJSON (preserves mandatory Geoman properties).
   *
   * Returns a Promise that resolves when the update is committed to MapLibre.
   */
  setGeoJsonCustomProperties(properties: Feature['properties']): Promise<void> {
    if (!this._geoJson) {
      throw new Error(`Feature not found: "${this.id}"`);
    }

    const mandatoryProperties = this.parseGmShapeProperties(this._geoJson);

    this._geoJson.properties = { ...properties, ...mandatoryProperties };

    const diff = { update: [this._geoJson] };
    this.gm.features.updateManager.updateSource({
      diff,
      sourceName: this.sourceName,
    });

    return this.sync();
  }

  /**
   * Update custom properties on the feature's GeoJSON (merges with existing).
   *
   * Returns a Promise that resolves when the update is committed to MapLibre.
   */
  updateGeoJsonCustomProperties(properties: Feature['properties']): Promise<void> {
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

    return this.sync();
  }

  /**
   * Delete custom properties from the feature's GeoJSON.
   *
   * Returns a Promise that resolves when the update is committed to MapLibre.
   */
  deleteGeoJsonCustomProperties(fieldNames: Array<string>): Promise<void> {
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

    return this.sync();
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

  // changeSource({ sourceName, atomic }: { sourceName: FeatureSourceName; atomic: boolean }) {
  //   if (atomic) {
  //     this.gm.features.updateManager.withAtomicSourcesUpdate(() =>
  //       this.actualChangeSource({ sourceName, atomic }),
  //     );
  //   } else {
  //     this.actualChangeSource({ sourceName, atomic });
  //   }
  // }

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

  delete() {
    this.removeGeoJson();
    this.removeMarkers();
  }

  /**
   * Wait for all pending source updates to be committed to MapLibre.
   *
   * Use this method when you need to ensure that changes made via methods like
   * `updateGeoJsonProperties()`, `updateGeoJsonGeometry()`, etc. are fully
   * committed before reading from the source.
   *
   * @example
   * ```typescript
   * map.on('gm:create', async (e) => {
   *   e.feature.updateGeoJsonProperties({ customProp: 'value' });
   *   await e.feature.sync();
   *   // Now safe to read from source
   *   console.log(e.feature.source.getGeoJson());
   * });
   * ```
   */
  async sync(): Promise<void> {
    await this.gm.features.updateManager.waitForPendingUpdates(this.sourceName);
  }
}
