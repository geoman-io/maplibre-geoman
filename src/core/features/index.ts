import { GM_SYSTEM_PREFIX, IS_PRO } from '@/core/constants.ts';
import { FEATURE_PROPERTY_PREFIX, SOURCES } from '@/core/features/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import { SourceUpdateManager } from '@/core/features/source-update-manager.ts';
import type { BaseLayer } from '@/core/map/base/layer.ts';
import { BaseSource } from '@/core/map/base/source.ts';
import {
  FEATURE_ID_PROPERTY,
  type FeatureId,
  type FeatureShape,
  type FeatureSourceName,
  type FeatureStore,
  type ForEachFeatureDataCallbackFn,
  type GeoJsonImportFeature,
  type GeoJsonImportFeatureCollection,
  type GeoJsonShapeFeature,
  type GeoJsonShapeFeatureCollection,
  type Geoman,
  type GmDrawFeatureCreatedEvent,
  type GmEditSelectionChangeEvent,
  type ImportGeoJsonOptions,
  isDefined,
  type LngLatTuple,
  type MarkerData,
  type PartialLayerStyle,
  type ScreenPoint,
  SHAPE_NAMES,
  type ShapeName,
  type SourcesStorage,
} from '@/main.ts';
import { dedupeById } from '@/utils/collections.ts';
import { fixGeoJsonFeature, getCustomFeatureId } from '@/utils/features.ts';
import { getGeoJsonBounds } from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import { includesWithType, typedKeys, typedValues } from '@/utils/typing.ts';
import type { BaseMapPointerEvent } from '@mapLib/types/events.ts';
import type {
  Feature,
  FeatureCollection,
  Geometry,
  LineString,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { cloneDeep } from 'lodash-es';
import log from 'loglevel';

export class Features {
  gm: Geoman;

  featureCounter: number = 0;
  featureStore: FeatureStore = new Map<FeatureId, FeatureData>();
  featureStoreAllowedSources: Array<FeatureSourceName> = [SOURCES.main, SOURCES.temporary];

  selection = new Set<FeatureId>();

  sources: SourcesStorage;
  defaultSourceName: FeatureSourceName = SOURCES.main;
  updateManager: SourceUpdateManager;
  layers: Array<BaseLayer>;

  constructor(gm: Geoman) {
    this.gm = gm;
    this.updateManager = new SourceUpdateManager(gm);

    this.sources = Object.fromEntries(
      typedValues(SOURCES).map((name) => [name, null]),
    ) as SourcesStorage;

    this.layers = [];
  }

  get forEach() {
    return this.filteredForEach((featureData) => !featureData.temporary);
  }

  get tmpForEach() {
    return this.filteredForEach((featureData) => featureData.temporary);
  }

  init() {
    if (Object.values(this.sources).some((source) => source !== null)) {
      log.warn('features.init(): features are already initialized');
      return;
    }

    typedKeys(this.sources).forEach((sourceName) => {
      this.sources[sourceName] = this.createSource(sourceName);
    });

    // Hydrate feature store from existing sources and sync the ID counter
    // This handles remounting when sources were preserved (removeSources: false)
    this.hydrateFromExistingSources();

    if (this.gm.options.settings.useDefaultLayers) {
      this.layers = this.createLayers();
    }
  }

  /**
   * Hydrates the feature store from existing sources and syncs the ID counter.
   * This is called during init to restore state when remounting on preserved sources.
   */
  hydrateFromExistingSources() {
    let maxCounter = 0;

    typedKeys(this.sources).forEach((sourceName) => {
      const source = this.sources[sourceName];
      if (!source) return;

      try {
        const geoJson = source.getGeoJson();
        if (geoJson && 'features' in geoJson) {
          for (const feature of geoJson.features) {
            const featureId = feature.properties?.[FEATURE_ID_PROPERTY] as FeatureId | undefined;
            if (!featureId) continue;

            // Track max counter for auto-generated IDs
            if (typeof featureId === 'string' && featureId.startsWith('feature-')) {
              const num = parseInt(featureId.replace('feature-', ''), 10);
              if (!isNaN(num) && num > maxCounter) {
                maxCounter = num;
              }
            }

            // Skip if already in feature store (shouldn't happen on fresh init)
            if (this.featureStore.has(featureId)) continue;

            // Create FeatureData for the existing feature
            // Use skipSourceUpdate since the feature already exists in the source
            const shapeGeoJson = feature as GeoJsonShapeFeature;
            const featureData = new FeatureData({
              gm: this.gm,
              id: featureId,
              parent: null,
              source,
              geoJsonShapeFeature: cloneDeep(shapeGeoJson),
              skipSourceUpdate: true,
            });

            this.featureStore.set(featureId, featureData);
          }
        }
      } catch {
        // Source might not be ready yet, ignore
      }
    });

    if (maxCounter > this.featureCounter) {
      this.featureCounter = maxCounter;
    }
  }

  getNewFeatureId(shapeGeoJson: GeoJsonShapeFeature): FeatureId {
    this.featureCounter += 1;

    if (this.gm.options.settings.idGenerator) {
      return this.gm.options.settings.idGenerator(shapeGeoJson);
    }

    let newFeatureId: FeatureId | null = `feature-${this.featureCounter}`;

    while (this.featureStore.has(newFeatureId)) {
      this.featureCounter += 1;
      newFeatureId = `feature-${this.featureCounter}`;
    }

    return newFeatureId;
  }

  filteredForEach(filterFn: (featureData: FeatureData) => boolean) {
    return (callbackfn: ForEachFeatureDataCallbackFn): void => {
      this.featureStore.forEach((featureData, featureId, featureStore) => {
        if (filterFn(featureData)) {
          callbackfn(featureData, featureId, featureStore);
        }
      });
    };
  }

  has(sourceName: keyof SourcesStorage, featureId: FeatureId): boolean {
    const featureData = this.featureStore.get(featureId);
    return !!featureData && featureData?.source === this.sources[sourceName];
  }

  get(sourceName: keyof SourcesStorage, featureId: FeatureId): FeatureData | null {
    const featureData = this.featureStore.get(featureId) || null;

    if (featureData?.source === this.sources[sourceName]) {
      return featureData;
    }
    return null;
  }

  add(featureData: FeatureData) {
    if (this.featureStore.has(featureData.id)) {
      log.error(`features.add: feature with the id "${featureData.id}" already exists`);
      return;
    }

    if (this.featureStoreAllowedSources.includes(featureData.source.id as FeatureSourceName)) {
      this.featureStore.set(featureData.id, featureData);
    }
  }

  setDefaultSourceName(sourceName: FeatureSourceName) {
    this.defaultSourceName = sourceName;
  }

  setSelection(featureIds: Array<FeatureId>, fireEvent = false) {
    this.selection = new Set(featureIds);
    if (fireEvent) {
      this.fireSelectionChangeEvent(featureIds);
    }
  }

  clearSelection() {
    this.selection.clear();
  }

  createSource(sourceName: FeatureSourceName) {
    const source = this.gm.mapAdapter.addSource(sourceName, {
      type: 'FeatureCollection',
      features: [],
    });

    if (source) {
      return source;
    }

    throw new Error(`Features: failed to create the source: "${sourceName}"`);
  }

  delete(featureIdOrFeatureData: FeatureData | FeatureId) {
    let featureData: FeatureData | null;

    if (featureIdOrFeatureData instanceof FeatureData) {
      featureData = featureIdOrFeatureData;
    } else {
      featureData = this.featureStore.get(featureIdOrFeatureData) || null;
    }

    if (featureData) {
      this.featureStore.delete(featureData.id);
      featureData.delete();
      // log.debug(`Feature removed: ${featureData.id}, source: ${featureData.sourceName}`);
    } else {
      log.error(`features.delete: feature "${featureIdOrFeatureData}" not found`);
    }
  }

  deleteAll() {
    this.featureStore.forEach((featureData) => {
      featureData.delete();
    });
    this.featureStore.clear();
  }

  getLinkedFeatures(featureData: FeatureData): FeatureData[] {
    const selectionFeatures = Array.from(this.selection)
      .map((featureId) => this.featureStore.get(featureId))
      .filter(isDefined);

    const groupNames = new Set(
      selectionFeatures.map((feature) => feature.getShapeProperty('group')).filter(isDefined),
    );

    const groupFeatures = Array.from(this.featureStore.values()).filter((featureData) => {
      const group = featureData.getShapeProperty('group');
      return SHAPE_NAMES.includes(featureData.shape as ShapeName) && group && groupNames.has(group);
    });

    return dedupeById([...selectionFeatures, ...groupFeatures]).filter(
      (f) => f.id !== featureData.id,
    );
  }

  getFeatureByMouseEvent({
    event,
    sourceNames,
  }: {
    event: BaseMapPointerEvent;
    sourceNames: Array<FeatureSourceName>;
  }): FeatureData | null {
    if (!isMapPointerEvent(event, { warning: true })) {
      return null;
    }

    const point: ScreenPoint = [event.point.x, event.point.y];
    const features = this.gm.mapAdapter.queryFeaturesByScreenCoordinates({
      queryCoordinates: point,
      sourceNames,
    });
    return features.length ? features[0] : null;
  }

  getFeaturesByGeoJsonBounds({
    geoJson,
    sourceNames,
  }: {
    geoJson: Feature<Polygon | MultiPolygon | LineString>;
    sourceNames: Array<FeatureSourceName>;
  }): Array<FeatureData> {
    const coordBounds = getGeoJsonBounds(geoJson);
    const polygonScreenBounds = this.gm.mapAdapter.coordBoundsToScreenBounds(coordBounds);

    return this.getFeaturesByScreenBounds({ bounds: polygonScreenBounds, sourceNames });
  }

  getFeaturesByScreenBounds({
    bounds,
    sourceNames,
  }: {
    bounds: [ScreenPoint, ScreenPoint];
    sourceNames: Array<FeatureSourceName>;
  }) {
    return this.gm.mapAdapter.queryFeaturesByScreenCoordinates({
      queryCoordinates: bounds,
      sourceNames,
    });
  }

  createFeature({
    featureId,
    shapeGeoJson,
    parent,
    sourceName,
    imported,
  }: {
    featureId?: FeatureId;
    shapeGeoJson: GeoJsonShapeFeature;
    parent?: FeatureData;
    sourceName: FeatureSourceName;
    imported?: boolean;
  }): FeatureData | null {
    const source = this.sources[sourceName];
    if (!source) {
      log.error('Features.createFeature Missing source for feature creation');
      return null;
    }

    const id =
      featureId ??
      shapeGeoJson.properties[FEATURE_ID_PROPERTY] ??
      this.getNewFeatureId(shapeGeoJson);

    if (this.featureStore.get(id)) {
      log.error(
        `Features.createFeature: feature with the id "${id}" already exists`,
        this.featureStore.get(id),
      );
      return null;
    }

    const featureData = new FeatureData({
      gm: this.gm,
      id,
      parent: parent || null,
      source,
      geoJsonShapeFeature: cloneDeep(shapeGeoJson),
    });

    this.add(featureData);
    if (!featureData.temporary && !imported) {
      this.fireFeatureCreatedEvent(featureData);
    }
    this.featureCounter += 1;
    return featureData;
  }

  importGeoJson(
    geoJson: GeoJsonImportFeatureCollection | GeoJsonImportFeature,
    options?: ImportGeoJsonOptions,
  ) {
    const opts = options ?? {};

    const features = 'features' in geoJson ? geoJson.features : [geoJson];
    const result = {
      stats: {
        total: 0,
        success: 0,
        failed: 0,
        overwritten: 0,
      },
      addedFeatures: [] as Array<FeatureData>,
    };

    features.forEach((feature) => {
      let featureData: FeatureData | null = null;
      result.stats.total += 1;

      const featureGeoJson = fixGeoJsonFeature(feature);
      if (featureGeoJson) {
        if (opts.idPropertyName) {
          const customId = getCustomFeatureId(featureGeoJson, opts.idPropertyName);
          if (customId) {
            featureGeoJson.id = customId;
          }
        }

        // Handle overwrite: delete existing feature with same ID before importing
        if (opts.overwrite) {
          const featureId = (featureGeoJson.id ??
            featureGeoJson.properties?.[FEATURE_ID_PROPERTY]) as FeatureId | undefined;
          if (featureId && this.featureStore.has(featureId)) {
            this.delete(featureId);
            result.stats.overwritten += 1;
          }
        }

        featureData = this.importGeoJsonFeature(featureGeoJson);
      }

      if (featureData) {
        result.addedFeatures.push(featureData);
        result.stats.success += 1;
      } else {
        result.stats.failed += 1;
      }
    });

    return result;
  }

  importGeoJsonFeature(shapeGeoJson: GeoJsonImportFeature): FeatureData | null {
    // add an externally created GeoJSON
    const sourceName: FeatureSourceName = this.defaultSourceName;

    const shape = this.getFeatureShapeByGeoJson(shapeGeoJson);
    if (!shape) {
      log.error('features.addGeoJsonFeature: unknown shape', shape);
      return null;
    }

    return this.createFeature({
      featureId: shapeGeoJson.id as FeatureId | undefined,
      shapeGeoJson,
      sourceName,
      imported: true,
    });
  }

  getAll(): FeatureCollection {
    return this.exportGeoJson();
  }

  /**
   * Exports GeoJSON from Geoman's internal state.
   *
   * This is the recommended method for most use cases as it always returns the latest
   * feature data, even during event handlers before MapLibre has committed changes.
   *
   * @param options - Export options
   * @param options.allowedShapes - Filter to only include specific shape types
   * @param options.idPropertyName - Property name to use for feature IDs (default: 'gm_id')
   * @returns GeoJSON FeatureCollection with all features
   *
   * @example
   * // Export all features
   * const geoJson = geoman.features.exportGeoJson();
   *
   * // Export only polygons and circles
   * const shapes = geoman.features.exportGeoJson({ allowedShapes: ['polygon', 'circle'] });
   */
  exportGeoJson(
    {
      allowedShapes,
      idPropertyName,
    }: {
      allowedShapes?: Array<FeatureShape>;
      idPropertyName?: string;
    } = { allowedShapes: undefined },
  ): GeoJsonShapeFeatureCollection {
    return this.asGeoJsonFeatureCollection({
      sourceNames: [SOURCES.main, ...(IS_PRO ? [SOURCES.standby] : [])],
      shapeTypes: allowedShapes ? allowedShapes : [...SHAPE_NAMES],
      idPropertyName,
      useMapLibreSource: false,
    });
  }

  /**
   * Exports GeoJSON directly from MapLibre's underlying source data.
   *
   * This method reads from MapLibre's serialized source state, which may lag slightly
   * behind Geoman's internal state during rapid updates or in event handlers.
   *
   * Use this method when you specifically need to verify what MapLibre has committed
   * to its source, for debugging, or for synchronization with external systems that
   * read directly from MapLibre sources.
   *
   * For most use cases, prefer `exportGeoJson()` which uses Geoman's internal state
   * and is always up-to-date.
   *
   * @param options - Export options
   * @param options.allowedShapes - Filter to only include specific shape types
   * @param options.idPropertyName - Property name to use for feature IDs (default: 'gm_id')
   * @returns GeoJSON FeatureCollection from MapLibre's source
   *
   * @example
   * // Export features as stored in MapLibre source
   * const geoJson = geoman.features.exportGeoJsonFromSource();
   *
   * // Verify MapLibre has committed the data
   * await geoman.features.waitForPendingUpdates();
   * const committed = geoman.features.exportGeoJsonFromSource();
   */
  exportGeoJsonFromSource(
    {
      allowedShapes,
      idPropertyName,
    }: {
      allowedShapes?: Array<FeatureShape>;
      idPropertyName?: string;
    } = { allowedShapes: undefined },
  ): GeoJsonShapeFeatureCollection {
    return this.asGeoJsonFeatureCollection({
      sourceNames: [SOURCES.main, ...(IS_PRO ? [SOURCES.standby] : [])],
      shapeTypes: allowedShapes ? allowedShapes : [...SHAPE_NAMES],
      idPropertyName,
      useMapLibreSource: true,
    });
  }

  asGeoJsonFeatureCollection({
    shapeTypes,
    sourceNames,
    idPropertyName,
    useMapLibreSource = false,
  }: {
    shapeTypes?: Array<FeatureShape>;
    sourceNames: Array<FeatureSourceName>;
    idPropertyName?: string;
    useMapLibreSource?: boolean;
  }): GeoJsonShapeFeatureCollection {
    const resultFeatureCollection: GeoJsonShapeFeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    idPropertyName ??= FEATURE_ID_PROPERTY;

    sourceNames.forEach((sourceName) => {
      const source = this.sources[sourceName];

      if (source) {
        // getGmGeoJson() returns features from internal FeatureData state (always up-to-date)
        // getGeoJson() returns features from MapLibre's serialize() (may lag during rapid updates)
        const sourceFeatureCollection = useMapLibreSource
          ? source.getGeoJson()
          : source.getGmGeoJson();

        sourceFeatureCollection.features
          .filter((feature) => !!feature)
          .forEach((feature) => {
            const featureData = this.get(sourceName, feature.id as FeatureId);
            if (!featureData) {
              // log.warn("Can't find featureData for the feature", feature);
              return;
            }

            const id = feature.properties[FEATURE_ID_PROPERTY];

            if (idPropertyName !== FEATURE_ID_PROPERTY) {
              feature.properties[idPropertyName] = id;
              delete feature.properties[FEATURE_ID_PROPERTY];
            }

            if (shapeTypes === undefined || shapeTypes.includes(featureData.shape)) {
              resultFeatureCollection.features.push({ ...feature, id });
            }
          });
      }
    });

    return resultFeatureCollection;
  }

  convertSourceToGm(inputSource: BaseSource): Array<FeatureData> {
    // adds an externally created source to the features store
    // the method converts the source/layers to internal format
    // original source/layers are removed

    const features: Array<FeatureData> = [];
    const shapeGeoJson = inputSource.getGeoJson();
    const sourceGeoJsonFeatures =
      'features' in shapeGeoJson ? shapeGeoJson.features : [shapeGeoJson];
    const baseSource = this.gm.mapAdapter.getSource(inputSource.id);
    baseSource.remove();

    sourceGeoJsonFeatures.forEach((sourceFeature) => {
      const featureData = this.addGeoJsonFeature({
        shapeGeoJson: sourceFeature as GeoJsonImportFeature,
        defaultSource: true,
      });

      if (featureData) {
        features.push(featureData);
      }
    });
    return features;
  }

  addGeoJsonFeature({
    shapeGeoJson,
    sourceName,
    defaultSource,
  }: {
    shapeGeoJson: GeoJsonImportFeature;
    sourceName?: FeatureSourceName;
    defaultSource?: boolean;
  }): FeatureData | null {
    let targetSourceName: FeatureSourceName | null;
    if (defaultSource) {
      targetSourceName = this.defaultSourceName;
      if (sourceName) {
        log.warn('features.addGeoJsonFeature: default source is set, sourceName is ignored');
      }
    } else {
      targetSourceName = sourceName || null;
    }

    if (!targetSourceName) {
      log.error('features.addGeoJsonFeature: missing sourceName');
      return null;
    }

    const shape = this.getFeatureShapeByGeoJson(shapeGeoJson);

    if (!shape) {
      log.error('features.addGeoJsonFeature: unknown shape', shape);
      return null;
    }

    return this.createFeature({
      featureId: shapeGeoJson.id as FeatureId | undefined,
      shapeGeoJson: {
        ...shapeGeoJson,
        properties: { ...shapeGeoJson.properties, shape },
      },
      sourceName: targetSourceName,
    });
  }

  createLayers(): Array<BaseLayer> {
    const layers: Array<BaseLayer> = [];

    typedKeys(this.sources).forEach((sourceName) => {
      typedKeys(this.gm.options.layerStyles).forEach((shapeName) => {
        const styles = this.gm.options.layerStyles[shapeName][sourceName];
        styles.forEach((partialStyle) => {
          const layer = this.createGenericLayer({
            sourceName,
            shapeNames: [shapeName],
            partialStyle,
          });

          if (layer) {
            layers.push(layer);
          }
        });
      });
    });

    return layers;
  }

  createGenericLayer({
    sourceName,
    shapeNames,
    partialStyle,
  }: {
    sourceName: FeatureSourceName;
    shapeNames: Array<FeatureShape>;
    partialStyle: PartialLayerStyle;
  }): BaseLayer | null {
    const layerId = this.getGenericLayerName({ sourceName, shapeNames, partialStyle });
    if (!layerId) {
      throw new Error(`Can't create a layer, for ${{ sourceName, shapeNames, partialStyle }}`);
    }

    const layerOptions = {
      ...partialStyle,
      id: layerId,
      source: sourceName,
      filter: ['in', ['get', `${FEATURE_PROPERTY_PREFIX}shape`], ['literal', shapeNames]],
    };

    return this.gm.mapAdapter.addLayer(layerOptions);
  }

  getGenericLayerName({
    sourceName,
    shapeNames,
    partialStyle,
  }: {
    sourceName: FeatureSourceName;
    shapeNames: Array<FeatureShape>;
    partialStyle: PartialLayerStyle;
  }): string | null {
    const MAX_LAYERS = 100;
    const shapeName = shapeNames.length === 1 ? shapeNames[0] : 'mixed';
    const getLayerId = (index: number) =>
      `${sourceName}-${shapeName}__${partialStyle.type}-layer-${index}`;
    let layerId: string | null = null;

    for (let i = 0; i < MAX_LAYERS; i += 1) {
      const tmpLayerId = getLayerId(i);
      if (!this.gm.mapAdapter.getLayer(tmpLayerId)) {
        layerId = tmpLayerId;
        return layerId;
      }
    }

    return null;
  }

  getFeatureShapeByGeoJson(shapeGeoJson: Feature): ShapeName | null {
    const SHAPE_MAP: { [key in Geometry['type']]?: ShapeName } = {
      Point: 'marker',
      LineString: 'line',
      MultiLineString: 'line',
      Polygon: 'polygon',
      MultiPolygon: 'polygon',
    };

    const properties = shapeGeoJson.properties;
    if (properties?.shape && SHAPE_NAMES.includes(properties?.shape)) {
      return properties?.shape;
    }

    return SHAPE_MAP[shapeGeoJson.geometry.type] || null;
  }

  createMarkerFeature({
    parentFeature,
    coordinate,
    type,
    sourceName,
  }: {
    type: MarkerData['type'];
    coordinate: LngLatTuple;
    parentFeature: FeatureData;
    sourceName: FeatureSourceName;
  }) {
    return this.createFeature({
      sourceName,
      parent: parentFeature,
      shapeGeoJson: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coordinate,
        },
        properties: {
          [`${FEATURE_PROPERTY_PREFIX}shape`]: `${type}_marker`,
        },
      },
    });
  }

  updateMarkerFeaturePosition(markerFeatureData: FeatureData, coordinates: LngLatTuple) {
    markerFeatureData.updateGeoJsonGeometry({
      type: 'Point',
      coordinates,
    });
  }

  fireFeatureCreatedEvent(featureData: FeatureData) {
    if (includesWithType(featureData.shape, SHAPE_NAMES)) {
      const payload: GmDrawFeatureCreatedEvent = {
        name: `${GM_SYSTEM_PREFIX}:draw:feature_created`,
        level: 'system',
        actionType: 'draw',
        mode: featureData.shape,
        action: 'feature_created',
        featureData,
      };
      this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, payload);
    }
  }

  fireSelectionChangeEvent(selection: FeatureId[]) {
    const payload: GmEditSelectionChangeEvent = {
      name: `${GM_SYSTEM_PREFIX}:edit:selection_change`,
      level: 'system',
      actionType: 'edit',
      action: 'selection_change',
      selection,
    };
    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:edit`, payload);
  }
}
