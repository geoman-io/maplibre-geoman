import { FeatureData } from '@/core/features/feature-data.ts';
import type { ModeName } from '@/types/controls.ts';
import { type GmBaseEvent, type NonEmptyArray } from '@/types/events/index.ts';

import type { GeoJsonShapeFeature } from '@/types/geojson.ts';

export interface GmBeforeFeatureCreateEvent extends GmBaseEvent {
  actionType: 'draw';
  mode: ModeName;
  action: 'before_create';
  geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
}

export interface GmBeforeFeatureUpdateEvent extends GmBaseEvent {
  actionType: 'edit';
  mode: ModeName;
  action: 'before_update';
  features: NonEmptyArray<FeatureData>;
  geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
}

export type GmFeatureEvent = GmBeforeFeatureUpdateEvent | GmBeforeFeatureCreateEvent;
