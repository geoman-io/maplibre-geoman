import { Geoman, type MapInstanceWithGeoman } from '@/main.ts';
import type {
  Feature,
  Geometry,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson';

// Base interface for all event results
export interface BaseEventResult {
  listenerIsAttached: boolean;
  shape?: string | null;
  feature?: boolean;
  features?: boolean;
  originalFeature?: boolean;
  originalFeatures?: boolean;
  featureId?: number | string | undefined;
}

// Define a type for window.customData that allows for any property
// but still provides type checking for known properties
export interface CustomData {
  rawEventResults?: { [key: string]: unknown },
  eventResults?: { [key: string]: BaseEventResult },
  map?: MapInstanceWithGeoman,
}

declare global {
  interface Window {
    geoman: Geoman;
    customData: CustomData;
  }
}

export const pointBasedGeometryType: Array<Geometry['type']> = ['Point', 'MultiPoint'];
export type PointBasedGeometryType = typeof pointBasedGeometryType[number];

export const lineBasedGeometryType: Array<Geometry['type']> = [
  'LineString',
  'MultiLineString',
  'Polygon',
  'MultiPolygon',
];
export type LineBasedGeometryType = typeof lineBasedGeometryType[number];

export const pointBasedFeatures = ['marker', 'circle_marker', 'text_marker'];
export type PointBasedFeature = typeof pointBasedFeatures[number];

export const lineBasedFeatures = ['circle', 'line', 'rectangle', 'polygon'];
export type LineBasedFeature = typeof lineBasedFeatures[number];


export const isPointBasedGeoJsonFeature = (
  feature: Feature,
): feature is Feature<Point | MultiPoint> => {
  return pointBasedGeometryType.includes(feature.geometry.type);
};

export const isLineBasedGeoJsonFeature = (
  feature: Feature,
): feature is Feature<LineString | MultiLineString | Polygon | MultiPolygon> => {
  return lineBasedGeometryType.includes(feature.geometry.type);
};
