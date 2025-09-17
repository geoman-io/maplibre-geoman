import type { FeatureData } from '@/core/features/feature-data.ts';
import type { FeatureShape } from '@/types/features.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';

import type { DrawModeName } from '@/types/modes/index.ts';

export interface FeatureCreatedFwdEvent {
  shape: DrawModeName;
  feature: FeatureData;
  map: AnyMapInstance;
}

export type FeatureRemovedFwdEvent = FeatureCreatedFwdEvent;

export interface FeatureUpdatedFwdEvent {
  map: AnyMapInstance;
  shape?: FeatureShape;
  feature?: FeatureData;
  features?: Array<FeatureData>;
  originalFeature?: FeatureData;
  originalFeatures?: Array<FeatureData>;
}

export type FeatureFwdEvent =
  | FeatureCreatedFwdEvent
  | FeatureRemovedFwdEvent
  | FeatureUpdatedFwdEvent;
