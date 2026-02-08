import type { ShapeGeoJsonProperties } from '@/types/features.ts';
import type { LngLatTuple } from '@/types/map/index.ts';
import type { ShapeName } from '@/types/modes/index.ts';
import type {
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson';

export type ImportGeoJsonProperties = {
  shape?: ShapeName;
  center?: LngLatTuple;
  text?: string;
  [key: string]: unknown;
};

export type PointBasedGeometry = Point | MultiPoint;

export type LineBasedGeometry = LineString | MultiLineString | Polygon | MultiPolygon;

export type BasicGeometry = PointBasedGeometry | LineBasedGeometry;

export type GeoJsonShapeFeature = Feature<BasicGeometry, ShapeGeoJsonProperties>;

export type GeoJsonImportFeature = Feature<BasicGeometry, ImportGeoJsonProperties>;

export type GeoJsonLineFeature = Feature<LineString, ShapeGeoJsonProperties>;

export type GeoJsonShapeFeatureCollection = FeatureCollection<
  BasicGeometry,
  ShapeGeoJsonProperties
>;

export type GeoJsonImportFeatureCollection = FeatureCollection<
  BasicGeometry,
  ImportGeoJsonProperties
>;

export type LngLatDiff = {
  lng: number;
  lat: number;
};

export interface PositionData {
  coordinate: LngLatTuple;
  path: Array<string | number>;
}

export type SegmentPosition = {
  start: PositionData;
  end: PositionData;
};

export type CoordinateIndices = {
  absCoordIndex: number;
  featureIndex: number;
  multiFeatureIndex: number;
  geometryIndex: number;
};

export type SimplePoint = {
  x: number;
  y: number;
  dist(p: { x: number; y: number }): number;
};
