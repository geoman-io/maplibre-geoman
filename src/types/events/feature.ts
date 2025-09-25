import { FeatureData } from '@/core/features/feature-data.ts';
import type { ModeName } from '@/types/controls.ts';
import { type GmBaseEvent, type GmPrefix, type NonEmptyArray } from '@/types/events/index.ts';

import type { GeoJsonShapeFeature } from '@/types/geojson.ts';

export interface GmFeatureBeforeCreateEvent extends GmBaseEvent {
  name: `${GmPrefix}:feature:before_create`;
  actionType: 'draw';
  mode: ModeName;
  action: 'before_create';
  geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
}

export interface GmFeatureBeforeUpdateEvent extends GmBaseEvent {
  name: `${GmPrefix}:feature:before_update`;
  actionType: 'edit';
  mode: ModeName;
  action: 'before_update';
  features: NonEmptyArray<FeatureData>;
  geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
}

export type GmFeatureEvent = GmFeatureBeforeUpdateEvent | GmFeatureBeforeCreateEvent;
