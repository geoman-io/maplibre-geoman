import { FeatureData } from '@/core/features/feature-data.ts';
import type { ModeName } from '@/types/controls.ts';
import { type GmBaseEvent, type NonEmptyArray } from '@/types/events/index.ts';

import type { GeoJsonShapeFeature } from '@/types/geojson.ts';

import type { ActionType } from '@/types/options.ts';

export interface GmBeforeFeatureCreateEvent extends GmBaseEvent {
  actionType: ActionType;
  mode: ModeName;
  action: 'before_create';
  geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
}

export interface GmBeforeFeatureUpdateEvent extends GmBaseEvent {
  actionType: ActionType;
  mode: ModeName;
  action: 'before_update';
  features: NonEmptyArray<FeatureData>;
  geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
}

export type GmFeatureEvent = GmBeforeFeatureUpdateEvent | GmBeforeFeatureCreateEvent;
