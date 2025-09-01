import type { GeoJsonLineFeature } from '@/types/geojson.ts';
import type { LngLat } from '@/types/map/index.ts';
import type { Position } from 'geojson';

export type LineEventHandlerArguments = {
  markerIndex: number;
  shapeCoordinates: Array<Position>;
  geoJson: GeoJsonLineFeature;
  bounds: [LngLat, LngLat];
};
