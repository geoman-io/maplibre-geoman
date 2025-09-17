import type { FeatureData } from '@/core/features/feature-data.ts';
import type { GmDrawShapeCreatedEvent } from '@/types/events/draw.ts';
import type { GmEditFeatureRemovedEvent, GmEditFeatureUpdatedEvent } from '@/types/events/edit.ts';
import type { FeatureShape } from '@/types/features.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';

import type { DrawModeName } from '@/types/modes/index.ts';

export interface FeatureCreatedFwdEvent
  extends Pick<GmDrawShapeCreatedEvent, 'actionType' | 'action'> {
  shape: DrawModeName;
  feature: FeatureData;
  map: AnyMapInstance;
}

export interface FeatureRemovedFwdEvent
  extends Pick<GmEditFeatureRemovedEvent, 'actionType' | 'action'> {
  shape: DrawModeName;
  feature: FeatureData;
  map: AnyMapInstance;
}

export interface FeatureUpdatedFwdEvent
  extends Pick<GmEditFeatureUpdatedEvent, 'actionType' | 'action'> {
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
