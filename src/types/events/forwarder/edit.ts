import { FeatureData } from '@/core/features/feature-data.ts';
import type {
  GmEditFeatureEditEndEvent,
  GmEditFeatureEditStartEvent,
  GmEditSelectionChangeEvent,
} from '@/types/events/edit.ts';
import type { FeatureId, FeatureShape } from '@/types/features.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';

import type { EditModeName } from '@/types/modes/index.ts';
import type { BaseFwdEvent } from '@/types/events/forwarder/base.ts';
import type { GmPrefix } from '@/types';

export type FwdEditModeName = EditModeName | 'edit';

export interface FeatureEditStartFwdEvent extends BaseFwdEvent<GmEditFeatureEditStartEvent> {
  name: `${GmPrefix}:${FwdEditModeName}start`;
  shape: FeatureShape;
  feature: FeatureData;
  map: AnyMapInstance;
}

export interface FeatureEditEndFwdEvent extends BaseFwdEvent<GmEditFeatureEditEndEvent> {
  name: `${GmPrefix}:${FwdEditModeName}end`;
  shape: FeatureShape;
  feature: FeatureData;
  map: AnyMapInstance;
}

export interface SelectionChangedFwdEvent extends BaseFwdEvent<GmEditSelectionChangeEvent> {
  name: `${GmPrefix}:selection`;
  selection: FeatureId[];
  map: AnyMapInstance;
}

export type FeatureEditFwdEvent =
  | FeatureEditStartFwdEvent
  | FeatureEditEndFwdEvent
  | SelectionChangedFwdEvent;
