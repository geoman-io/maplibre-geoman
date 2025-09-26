import type { FeatureData } from '@/core/features/feature-data.ts';
import type { GmDrawFeatureCreatedEvent } from '@/types/events/draw.ts';
import type { GmEditFeatureRemovedEvent, GmEditFeatureUpdatedEvent } from '@/types/events/edit.ts';
import type { FeatureShape } from '@/types/features.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';

import type { DrawModeName } from '@/types/modes/index.ts';
import type { BaseFwdEvent } from '@/types/events/forwarder/base.ts';
import type { FwdEditModeName, GmPrefix } from '@/types';

export interface FeatureCreatedFwdEvent extends BaseFwdEvent<GmDrawFeatureCreatedEvent> {
  name: `${GmPrefix}:create`;
  shape: DrawModeName;
  feature: FeatureData;
  map: AnyMapInstance;
}

export interface FeatureRemovedFwdEvent extends BaseFwdEvent<GmEditFeatureRemovedEvent> {
  name: `${GmPrefix}:remove`;
  shape: DrawModeName;
  feature: FeatureData;
  map: AnyMapInstance;
}

export interface FeatureUpdatedFwdEvent extends BaseFwdEvent<GmEditFeatureUpdatedEvent> {
  name: `${GmPrefix}:${FwdEditModeName}`;
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
