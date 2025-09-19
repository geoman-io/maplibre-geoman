import type { FeatureData } from '@/core/features/feature-data.ts';
import type { BaseSource } from '@/core/map/base/source.ts';
import { FEATURE_ID_PROPERTY, type Geoman, SOURCES } from '@/main.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLat } from '@/types/map/index.ts';
import type { MarkerData, ShapeName } from '@/types/modes/index.ts';
import type { WithPrefixedKeys } from '@/types/utils.ts';
import { FEATURE_PROPERTY_PREFIX } from '@/core/features/constants.ts';

export type FeatureId = number | string;

export type FeatureShape = ShapeName | `${MarkerData['type']}_marker` | 'snap_guide';

export type ShapeGeoJsonProperties = {
  [FEATURE_ID_PROPERTY]?: FeatureId;
  [key: string]: unknown;
};

export type FeatureDataParameters = {
  gm: Geoman;
  id: FeatureId;
  parent: FeatureData | null;
  source: BaseSource;
  geoJsonShapeFeature: GeoJsonShapeFeature;
};

export type FeatureSourceName = (typeof SOURCES)[keyof typeof SOURCES];
export type SourcesStorage = { [key in FeatureSourceName]: BaseSource | null };
export type FeatureStore = Map<FeatureId, FeatureData>;
export type ForEachFeatureDataCallbackFn = (
  value: FeatureData,
  key: FeatureId,
  map: FeatureStore,
) => void;

export type FeatureShapeProperties = {
  id?: FeatureId;
  shape?: FeatureShape;
  center?: LngLat;
  xSemiAxis?: number;
  ySemiAxis?: number;
  angle?: number;
  text?: string;
  disableEdit?: boolean;
};

export type PrefixedFeatureShapeProperties = WithPrefixedKeys<
  FeatureShapeProperties,
  typeof FEATURE_PROPERTY_PREFIX
>;
