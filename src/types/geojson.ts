import type {
  EllipseGeoJsonInternalProperties,
  EllipseProperties,
  ShapeGeoJsonProperties,
} from '@/types/features.ts';
import type { LngLat } from '@/types/map/index.ts';
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
import type { SetRequired } from 'type-fest';

export type ImportGeoJsonProperties =
  | {
      shape?: Exclude<ShapeName, 'ellipse'>;
      center?: LngLat;
      radius?: number;
      text?: string;
      [key: string]: unknown;
    }
  | ImportEllipseGeoJsonProperties;

export type ImportEllipseGeoJsonProperties = EllipseProperties & EllipseGeoJsonInternalProperties;

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

export type GeoJsonShapeFeatureWithGmProperties = Omit<GeoJsonShapeFeature, 'properties'> & {
  properties: SetRequired<GeoJsonShapeFeature['properties'], '_gmid'>;
};

export type LngLatDiff = {
  lng: number;
  lat: number;
};

export interface PositionData {
  coordinate: LngLat;
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
