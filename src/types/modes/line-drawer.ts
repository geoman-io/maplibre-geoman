import type { GeoJsonLineFeature } from '@/types/geojson.ts';
import type { LngLatTuple } from '@/types/map/index.ts';
import type { Position } from 'geojson';

export type LineEventHandlerArguments = {
  markerIndex: number;
  shapeCoordinates: Array<Position>;
  geoJson: GeoJsonLineFeature;
  bounds: [LngLatTuple, LngLatTuple];
};
