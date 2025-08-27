import { gmPrefix } from '@/core/events/listeners/base.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import { SourceUpdateManager } from '@/core/features/source-update-manager.ts';
import type { BaseLayer } from '@/core/map/base/layer.ts';
import { BaseSource } from '@/core/map/base/source.ts';
import type {
  AnyEvent,
  FeatureId,
  FeatureShape,
  FeatureSourceName,
  FeatureStore,
  ForEachFeatureDataCallbackFn,
  GeoJsonImportFeature,
  GeoJsonImportFeatureCollection,
  GeoJsonShapeFeature,
  GeoJsonShapeFeatureCollection,
  Geoman,
  GMDrawShapeCreatedEvent,
  LngLat,
  MarkerData,
  PartialLayerStyle,
  ScreenPoint,
  ShapeName,
  SourcesStorage,
} from '@/main.ts';
import { shapeNames } from '@/modes/draw/base.ts';
import { IS_PRO } from '@/utils/behavior.ts';
import { fixGeoJsonFeature } from '@/utils/features.ts';
import { getGeoJsonBounds } from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import { includesWithType, typedKeys, typedValues } from '@/utils/typing.ts';
import type { Feature, FeatureCollection, GeoJSON, Geometry, LineString, MultiPolygon, Polygon } from 'geojson';
import { cloneDeep } from 'lodash-es';
import log from 'loglevel';


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

  init() {
    if (Object.values(this.sources).some((source) => source !== null)) {
      log.warn('features.init(): features are already initialized');
      return;
    }

    typedKeys(this.sources).forEach((sourceName) => {
      this.sources[sourceName] = this.createSource(sourceName);
    });

    if (this.gm.options.settings.useDefaultLayers) {
      this.layers = this.createLayers();
    }
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
      featureData.delete();
      this.featureStore.delete(featureData.id);
      log.debug(`Feature removed: ${featureData.id}, source: ${featureData.sourceName}`);
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

  createGenericLayer({ sourceName, shapeNames, partialStyle }: {
    sourceName: FeatureSourceName,
    shapeNames: Array<FeatureShape>,
    partialStyle: PartialLayerStyle,
  }): BaseLayer | null {
    const layerId = this.getGenericLayerName({ sourceName, shapeNames, partialStyle });
    if (!layerId) {
      throw new Error(`Can't create a layer, for ${{ sourceName, shapeNames, partialStyle }}`);
    }

    const layerOptions = {
      ...partialStyle,
      id: layerId,
      source: sourceName,
      filter: [
        'in',
        ['get', 'shape'],
        ['literal', shapeNames],
      ],
    };

    return this.gm.mapAdapter.addLayer(layerOptions);
  }

  getGenericLayerName({ sourceName, shapeNames, partialStyle }: {
    sourceName: FeatureSourceName,
    shapeNames: Array<FeatureShape>,
    partialStyle: PartialLayerStyle,
  }): string | null {
    const MAX_LAYERS = 100;
    const shapeName = shapeNames.length === 1 ? shapeNames[0] : 'mixed';
    const getLayerId = (index: number) => `${sourceName}-${shapeName}__${partialStyle.type}-layer-${index}`;
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
