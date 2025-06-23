import type { FeatureData } from '@/core/features/feature-data.ts';
import { FEATURE_ID_PROPERTY, SOURCES } from '@/core/features/index.ts';
import type { BaseSource } from '@/core/map/base/source.ts';
import type { Geoman } from '@/main.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { GeoJsonDiffStorage, LngLat } from '@/types/map/index.ts';
import type { MarkerData, ShapeName } from '@/types/modes/index.ts';


export type FeatureId = number | string;

export type ShapeGeoJsonProperties = {
  shape: FeatureShape,
  [FEATURE_ID_PROPERTY]?: FeatureId,
  center?: LngLat,
  text?: string,
  [key: string]: unknown,
};
export type FeatureDataParameters = {
  gm: Geoman,
  id: FeatureId,
  parent: FeatureData | null,
  source: BaseSource,
  geoJsonShapeFeature: GeoJsonShapeFeature,
};

export type FeatureOrder = number | null;
export type FeatureSourceName = typeof SOURCES[keyof typeof SOURCES];
export type SourcesStorage = { [key in FeatureSourceName]: BaseSource | null };
export type UpdateStorage = { [key in FeatureSourceName]: GeoJsonDiffStorage };
export type SourceUpdateMethods = {
  [key in FeatureSourceName]: {
    debounced: () => void,
    throttled: () => void,
  }
};
export type FeatureStore = Map<FeatureId, FeatureData>;
export type ForEachFeatureDataCallbackFn = (
  value: FeatureData,
  key: FeatureId,
  map: FeatureStore,
) => void;
export type FeatureOrders = Record<FeatureSourceName, FeatureOrder>;
export type FeatureShapeProperties = {
  center: LngLat | null,
};

export type FeatureShape = ShapeName | `${MarkerData['type']}_marker` | 'snap_guide';
