import { gmPrefix } from '@/core/events/listeners/base.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import type { BaseLayer } from '@/core/map/base/layer.ts';
import { BaseSource } from '@/core/map/base/source.ts';
import type {
  AnyEvent,
  FeatureId,
  FeatureShape,
  FeatureSourceName,
  FeatureStore,
  ForEachFeatureDataCallbackFn,
  GeoJsonDiffStorage,
  GeoJsonImportFeature,
  GeoJsonImportFeatureCollection,
  GeoJsonShapeFeature,
  GeoJsonShapeFeatureCollection,
  GeoJsonSourceDiff,
  Geoman,
  GMDrawShapeCreatedEvent,
  LngLat,
  MarkerData,
  PartialLayerStyle,
  ScreenPoint,
  ShapeName,
  SourcesStorage,
  SourceUpdateMethods,
  UpdateStorage,
} from '@/main.ts';
import { shapeNames } from '@/modes/draw/base.ts';
import { fixGeoJsonFeature } from '@/utils/features.ts';
import { getGeoJsonBounds } from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import { includesWithType, typedKeys, typedValues } from '@/utils/typing.ts';
import type { Feature, FeatureCollection, GeoJSON, Geometry, LineString, MultiPolygon, Polygon } from 'geojson';
import { cloneDeep, debounce, throttle } from 'lodash-es';
import log from 'loglevel';
import { IS_PRO } from '@/utils/behavior.ts';


export const SOURCES: { [key: string]: string } = {
  // order matters here, layers order will be aligned according to these items
  ...(IS_PRO && { standby: `${gmPrefix}_standby` }), // available only in the pro version
  main: `${gmPrefix}_main`,
  temporary: `${gmPrefix}_temporary`,
} as const;

export const FEATURE_ID_PROPERTY = '_gmid' as const;

export class Features {
  gm: Geoman;

  featureCounter: number = 0;
  featureStore: FeatureStore = new Map<FeatureId, FeatureData>();
  featureStoreAllowedSources: Array<FeatureSourceName> = [SOURCES.main, SOURCES.temporary];
  autoUpdatesEnabled: boolean = true;
  diffUpdatesEnabled: boolean = true;

  sources: SourcesStorage;
  defaultSourceName: FeatureSourceName = SOURCES.main;
  updateStorage: UpdateStorage;
  delayedSourceUpdateMethods: SourceUpdateMethods;
  layers: Array<BaseLayer>;

  constructor(gm: Geoman) {
    this.gm = gm;

    this.sources = Object.fromEntries(
      typedValues(SOURCES).map((name) => [name, null]),
    ) as SourcesStorage;

    this.updateStorage = Object.fromEntries(
      typedValues(SOURCES).map((name) => [
        name,
        { add: [] as Array<Feature>, remove: [] as Array<FeatureId>, update: [] as Array<Feature> },
      ]),
    ) as UpdateStorage;

    this.delayedSourceUpdateMethods = Object.fromEntries(
      typedValues(SOURCES).map((sourceName) => [
        sourceName,
        {
          throttled: this.getDelayedSourceUpdateMethod({
            sourceName,
            type: 'throttled',
          }),
          debounced: this.getDelayedSourceUpdateMethod({
            sourceName,
            type: 'debounced',
          }),
        } as { debounced: () => void, throttled: () => void },
      ]),
    ) as SourceUpdateMethods;

    this.layers = [];
  }

  init() {
    if (Object.values(this.sources).some((source) => source !== null)) {
      log.warn('features.init(): features are already initialized');
      return;
    }

    typedKeys(this.sources).forEach((sourceName) => {
      this.sources[sourceName] = this.createSource(sourceName);
    });

    this.layers = this.createLayers();
  }

  get forEach() {
    return this.filteredForEach((featureData) => !featureData.temporary);
  }

  get tmpForEach() {
    return this.filteredForEach((featureData) => featureData.temporary);
  }

  getNewFeatureId(): FeatureId {
    this.featureCounter += 1;
    return `feature-${this.featureCounter}`;
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

  getDelayedSourceUpdateMethod(
    { sourceName, type }: {
      sourceName: FeatureSourceName,
      type: 'throttled' | 'debounced',
    },
  ) {
    if (type === 'throttled') {
      return throttle(
        () => this.updateSourceByStorage(sourceName),
        2 * this.gm.options.settings.throttlingDelay,
        { leading: false, trailing: true },
      );
    } else if (type === 'debounced') {
      return debounce(
        () => this.updateSourceByStorage(sourceName),
        2 * this.gm.options.settings.throttlingDelay,
        { leading: true, trailing: false },
      );
    } else {
      throw new Error('Features: getDelayedSourceUpdateMethod: invalid type');
    }
  }

  updateSourceByStorage(sourceName: FeatureSourceName) {
    const source = this.sources[sourceName];
    const updateStorage = this.updateStorage[sourceName];

    const updatesAvailable = Object.values(updateStorage).some((item) => item.length);

    if (source && updatesAvailable) {
      source.updateData(updateStorage);
      this.resetDiffStorage(sourceName);
    }
  }

  resetDiffStorage(sourceName: FeatureSourceName) {
    const updateStorage = this.updateStorage[sourceName];

    updateStorage.add = [];
    updateStorage.remove = [];
    updateStorage.update = [];
  }

  withAtomicSourcesUpdate<T>(callback: () => T): T {
    try {
      this.autoUpdatesEnabled = false;
      return callback();
    } finally {
      typedValues(SOURCES).forEach((sourceName) => {
        this.updateSourceByStorage(sourceName);
      });
      this.autoUpdatesEnabled = true;
    }
  }

  updateSourceData({ diff, sourceName }: {
    diff: GeoJsonSourceDiff,
    sourceName: FeatureSourceName,
  }) {
    if (this.gm.features.diffUpdatesEnabled) {
      this.updateSourceDataWithDiff({ diff, sourceName });
    } else {
      this.setSourceData({ diff, sourceName });
    }
  }

  updateSourceDataWithDiff({ diff, sourceName }: {
    diff: GeoJsonSourceDiff,
    sourceName: FeatureSourceName
  }) {
    const updateStorage: GeoJsonDiffStorage = this.updateStorage[sourceName];

    if (diff.add) {
      updateStorage.add = updateStorage.add.concat(diff.add);
    }
    if (diff.update) {
      updateStorage.update = updateStorage.update.concat(diff.update);
    }
    if (diff.remove) {
      updateStorage.remove = updateStorage.remove.concat(diff.remove);
    }

    if (this.gm.features.autoUpdatesEnabled) {
      this.delayedSourceUpdateMethods[sourceName].throttled();
      this.delayedSourceUpdateMethods[sourceName].debounced();
    }
  }

  setSourceData({ sourceName }: {
    diff: GeoJsonSourceDiff,
    sourceName: FeatureSourceName,
  }) {
    log.warn('Review this Features.setSourceData() method');
    const fcGeoJson = this.getSourceGeoJson(sourceName);
    fcGeoJson.features = fcGeoJson.features.filter((feature) => !!feature);
    this.setSourceGeoJson({ geoJson: fcGeoJson, sourceName });
  }

  createSource(sourceName: FeatureSourceName) {
    const source = this.gm.mapAdapter.addSource(
      sourceName,
      {
        type: 'FeatureCollection',
        features: [],
      },
    );

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
      featureData.removeMarkers();
      featureData.removeGeoJson();
      this.featureStore.delete(featureData.id);
    } else {
      log.error(`features.delete: feature "${featureIdOrFeatureData}" not found`);
    }
  }

  getFeatureByMouseEvent({ event, sourceNames }: {
    event: AnyEvent,
    sourceNames: Array<FeatureSourceName>,
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

  getFeaturesByGeoJsonBounds({ geoJson, sourceNames }: {
    geoJson: Feature<Polygon | MultiPolygon | LineString>,
    sourceNames: Array<FeatureSourceName>,
  }): Array<FeatureData> {
    const coordBounds = getGeoJsonBounds(geoJson);
    const polygonScreenBounds = this.gm.mapAdapter.coordBoundsToScreenBounds(coordBounds);

    return this.getFeaturesByScreenBounds({ bounds: polygonScreenBounds, sourceNames });
  }

  getFeaturesByScreenBounds({ bounds, sourceNames }: {
    bounds: [ScreenPoint, ScreenPoint],
    sourceNames: Array<FeatureSourceName>,
  }) {
    return this.gm.mapAdapter.queryFeaturesByScreenCoordinates({
      queryCoordinates: bounds,
      sourceNames,
    });
  }

  createFeature(
    { featureId, shapeGeoJson, parent, sourceName, imported }: {
      featureId?: FeatureId,
      shapeGeoJson: GeoJsonShapeFeature,
      parent?: FeatureData,
      sourceName: FeatureSourceName,
      imported?: boolean
    },
  ): FeatureData | null {
    const source = this.sources[sourceName];
    if (!source) {
      log.error('Features.createFeature Missing source for feature creation');
      return null;
    }

    const id = featureId
      || shapeGeoJson.properties[FEATURE_ID_PROPERTY]
      || this.getNewFeatureId();

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

  importGeoJson(geoJson: GeoJsonImportFeatureCollection | GeoJsonImportFeature) {
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

      const fixedFeature = fixGeoJsonFeature(feature);
      if (fixedFeature) {
        featureData = this.importGeoJsonFeature(fixedFeature);
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

    const featureId = shapeGeoJson.id || `${sourceName}-feature-${this.featureCounter}`;

    return this.createFeature({
      featureId: shapeGeoJson.id as FeatureId | undefined,
      shapeGeoJson: {
        ...shapeGeoJson,
        properties: {
          ...shapeGeoJson.properties,
          [FEATURE_ID_PROPERTY]: featureId,
          shape,
        },
      },
      sourceName,
      imported: true,
    });
  }

  getAll(): FeatureCollection {
    return this.exportGeoJson();
  }

  exportGeoJson(
    { allowedShapes }: {
      allowedShapes?: Array<FeatureShape>
    } = { allowedShapes: undefined },
  ): GeoJsonShapeFeatureCollection {
    return this.asGeoJsonFeatureCollection({
      sourceNames: [
        SOURCES.main,
        ...(IS_PRO ? [SOURCES.standby] : []),
      ],
      shapeTypes: allowedShapes ? allowedShapes : [...shapeNames],
    });
  }

  getSourceGeoJson(sourceName: FeatureSourceName): GeoJsonShapeFeatureCollection {
    const source = this.sources[sourceName];
    if (!source) {
      throw new Error(`getSourceGeoJson: missing source "${sourceName}"`);
    }
    return source.getGeoJson();
  }

  setSourceGeoJson({ geoJson, sourceName }: {
    geoJson: GeoJSON,
    sourceName: FeatureSourceName,
  }) {
    const source = this.sources[sourceName];
    if (!source) {
      throw new Error(`setSourceGeoJson: missing source "${sourceName}"`);
    }
    source.setGeoJson(geoJson);
  }

  asGeoJsonFeatureCollection(
    { shapeTypes, sourceNames }: {
      shapeTypes?: Array<FeatureShape>,
      sourceNames: Array<FeatureSourceName>,
    },
  ): GeoJsonShapeFeatureCollection {
    const resultFeatureCollection: GeoJsonShapeFeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    sourceNames.forEach((sourceName) => {
      const source = this.sources[sourceName];

      if (source) {
        const sourceFeatureCollection = source.getGeoJson();

        sourceFeatureCollection.features
          .filter((feature) => !!feature)
          .forEach((feature) => {
            if (shapeTypes === undefined || shapeTypes.includes(feature.properties.shape)) {
              resultFeatureCollection.features.push(feature);
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
    const sourceGeoJsonFeatures = 'features' in shapeGeoJson ? shapeGeoJson.features : [shapeGeoJson];
    const baseSource = this.gm.mapAdapter.getSource(inputSource.id);
    baseSource.remove({ removeLayers: false });

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

  addGeoJsonFeature({ shapeGeoJson, sourceName, defaultSource }: {
    shapeGeoJson: GeoJsonImportFeature,
    sourceName?: FeatureSourceName,
    defaultSource?: boolean,
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
            layerId: `${sourceName}-${shapeName}__${partialStyle.type}-layer`,
            partialStyle,
            shape: shapeName,
            sourceName,
          });

          if (layer) {
            layers.push(layer);
          }
        });
      });
    });

    return layers;
  }

  createGenericLayer({ layerId, sourceName, partialStyle, shape }: {
    layerId: string,
    partialStyle: PartialLayerStyle,
    shape: FeatureShape,
    sourceName: FeatureSourceName,
  }): BaseLayer | null {
    const layerOptions = {
      ...partialStyle,
      id: layerId,
      source: sourceName,
      filter: [
        'in',
        ['get', 'shape'],
        ['literal', [shape]],
      ],
    };

    return this.gm.mapAdapter.addLayer(layerOptions);
  }

  getFeatureShapeByGeoJson(shapeGeoJson: GeoJsonImportFeature): ShapeName | null {
    const SHAPE_MAP: { [key in Geometry['type']]?: ShapeName } = {
      Point: 'marker',
      LineString: 'line',
      Polygon: 'polygon',
      MultiPolygon: 'polygon',
    };

    const properties = shapeGeoJson.properties;
    if (properties?.shape && shapeNames.includes(properties?.shape)) {
      return properties?.shape;
    }

    return SHAPE_MAP[shapeGeoJson.geometry.type] || null;
  }

  createMarkerFeature(
    { parentFeature, coordinate, type, sourceName }: {
      type: MarkerData['type'],
      coordinate: LngLat,
      parentFeature: FeatureData,
      sourceName: FeatureSourceName,
    },
  ) {
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
          shape: `${type}_marker`,
        },
      },
    });
  }

  updateMarkerFeaturePosition(markerFeatureData: FeatureData, coordinates: LngLat) {
    markerFeatureData.updateGeoJsonGeometry({
      type: 'Point',
      coordinates,
    });
  }

  fireFeatureCreatedEvent(featureData: FeatureData) {
    if (includesWithType(featureData.shape, shapeNames)) {
      const payload: GMDrawShapeCreatedEvent = {
        level: 'system',
        type: 'draw',
        mode: featureData.shape,
        action: 'feature_created',
        featureData,
      };
      this.gm.events.fire(`${gmPrefix}:draw`, payload);
    }
  }
}
