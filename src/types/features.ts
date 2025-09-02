import type { FeatureData } from '@/core/features/feature-data.ts';
import type { BaseSource } from '@/core/map/base/source.ts';
import { FEATURE_ID_PROPERTY, type Geoman, SOURCES } from '@/main.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLat } from '@/types/map/index.ts';
import type { MarkerData, ShapeName } from '@/types/modes/index.ts';

export type FeatureId = number | string;

export type ShapeGeoJsonProperties =
  | {
      shape: Exclude<FeatureShape, 'ellipse'>;
      [FEATURE_ID_PROPERTY]?: FeatureId;
      center?: LngLat;
      text?: string;
      [key: string]: unknown;
    }
  | EllipseGeoJsonProperties;

export type EllipseGeoJsonInternalProperties = {
  _gm_shape_center: LngLat;
  _gm_shape_xSemiAxis: number;
  _gm_shape_ySemiAxis: number;
  _gm_shape_angle: number;
};

export interface EllipseProperties {
  shape: 'ellipse';
  [key: string]: unknown;
}

export type EllipseGeoJsonProperties = EllipseProperties &
  Partial<EllipseGeoJsonInternalProperties> & {
    [FEATURE_ID_PROPERTY]?: FeatureId;
  };

export type FeatureDataParameters = {
  gm: Geoman;
  id: FeatureId;
  parent: FeatureData | null;
  source: BaseSource;
  geoJsonShapeFeature: GeoJsonShapeFeature;
};

export type FeatureOrder = number | null;
export type FeatureSourceName = (typeof SOURCES)[keyof typeof SOURCES];
export type SourcesStorage = { [key in FeatureSourceName]: BaseSource | null };
export type FeatureStore = Map<FeatureId, FeatureData>;
export type ForEachFeatureDataCallbackFn = (
  value: FeatureData,
  key: FeatureId,
  map: FeatureStore,
) => void;
export type FeatureOrders = Record<FeatureSourceName, FeatureOrder>;
export type FeatureShapeProperties = {
  center: LngLat | null;
  xSemiAxis?: number;
  ySemiAxis?: number;
  angle?: number;
};

export type FeatureShape = ShapeName | `${MarkerData['type']}_marker` | 'snap_guide';
