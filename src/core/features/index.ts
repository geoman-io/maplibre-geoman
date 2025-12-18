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
  type LngLatTuple,
  type MarkerData,
  type PartialLayerStyle,
  type ScreenPoint,
  SHAPE_NAMES,
  type ShapeName,
  type SourcesStorage,
} from '@/main.ts';
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
  /** @internal */
  gm: Geoman;

  /** @internal */
  featureCounter: number = 0;
  /** @internal */
  featureStore: FeatureStore = new Map<FeatureId, FeatureData>();
  /** @internal */
  featureStoreAllowedSources: Array<FeatureSourceName> = [SOURCES.main, SOURCES.temporary];

  /** @internal */
  sources: SourcesStorage;
  /** @internal */
  defaultSourceName: FeatureSourceName = SOURCES.main;
  /** @internal */
  updateManager: SourceUpdateManager;
  /** @internal */
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

  /** @internal */
  get tmpForEach() {
    return this.filteredForEach((featureData) => featureData.temporary);
  }

  /** @internal */
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
   * @internal
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

  /** @internal */
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

  /** @internal */
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

  /** @internal */
  add(featureData: FeatureData) {
    if (this.featureStore.has(featureData.id)) {
      log.error(`features.add: feature with the id "${featureData.id}" already exists`);
      return;
    }

    if (this.featureStoreAllowedSources.includes(featureData.source.id as FeatureSourceName)) {
      this.featureStore.set(featureData.id, featureData);
    }
  }

  /** @internal */
  setDefaultSourceName(sourceName: FeatureSourceName) {
    this.defaultSourceName = sourceName;
  }

  /** @internal */
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

  /** @internal */
  deleteAll() {
    this.featureStore.forEach((featureData) => {
      featureData.delete();
    });
    this.featureStore.clear();
  }

  /** @internal */
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

  /** @internal */
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

  /** @internal */
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

  /** @internal */
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
    idPropertyName?: string,
  ) {
    const features = 'features' in geoJson ? geoJson.features : [geoJson];
    const result = {
      stats: {
        total: 0,
        success: 0,
        failed: 0,
      },
      addedFeatures: [] as Array<FeatureData>,
    };

    features.forEach((feature) => {
      let featureData: FeatureData | null = null;
      result.stats.total += 1;

      const featureGeoJson = fixGeoJsonFeature(feature);
      if (featureGeoJson) {
        if (idPropertyName) {
          const customId = getCustomFeatureId(featureGeoJson, idPropertyName);
          if (customId) {
            featureGeoJson.id = customId;
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

  /** @internal */
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

  /** @internal */
  getAll(): FeatureCollection {
    return this.exportGeoJson();
  }

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
    });
  }

  /** @internal */
  asGeoJsonFeatureCollection({
    shapeTypes,
    sourceNames,
    idPropertyName,
  }: {
    shapeTypes?: Array<FeatureShape>;
    sourceNames: Array<FeatureSourceName>;
    idPropertyName?: string;
  }): GeoJsonShapeFeatureCollection {
    const resultFeatureCollection: GeoJsonShapeFeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    idPropertyName ??= FEATURE_ID_PROPERTY;

    sourceNames.forEach((sourceName) => {
      const source = this.sources[sourceName];

      if (source) {
        // Use getGmGeoJson() to get features from internal FeatureData state
        // This ensures newly created features are included even if MapLibre's
        // serialize() hasn't been updated yet (e.g., during gm:create event)
        const sourceFeatureCollection = source.getGmGeoJson();

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

  /** @internal */
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

  /** @internal */
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

  /** @internal */
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

  /** @internal */
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

  /** @internal */
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

  /** @internal */
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

  /** @internal */
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

  /** @internal */
  updateMarkerFeaturePosition(markerFeatureData: FeatureData, coordinates: LngLatTuple) {
    markerFeatureData.updateGeoJsonGeometry({
      type: 'Point',
      coordinates,
    });
  }

  /** @internal */
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
}
