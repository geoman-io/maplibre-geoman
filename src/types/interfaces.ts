import { BaseHelper } from '@/modes/helpers/base.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLat } from '@/types/map';
import type { MarkerData } from '@/types/modes';
import { FeatureData } from '@/core/features/feature-data.ts';

export type SharedMarker = {
  markerData: MarkerData;
  featureData: FeatureData;
};

export interface SnapGuidesHelperInterface extends BaseHelper {
  removeSnapGuides(): void;

  updateSnapGuides(
    shapeGeoJson: GeoJsonShapeFeature | null,
    currentLngLat: LngLat | null,
    withControlMarker?: boolean,
  ): void;
}

export interface AutoTraceHelperInterface extends BaseHelper {
  mode: 'auto_trace';

  getShortestPath(lngLatStart: LngLat, lngLatEnd: LngLat): Array<LngLat> | null;
}

export interface PinHelperInterface extends BaseHelper {
  mode: 'pin';

  getSharedMarkers(coordinate: LngLat): Array<SharedMarker>;
}
