import { FeatureData } from '@/core/features/feature-data.ts';
import type {
  GmEditFeatureEditEndEvent,
  GmEditFeatureEditStartEvent,
} from '@/types/events/edit.ts';
import type { FeatureShape } from '@/types/features.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';

import type { EditModeName } from '@/types/modes/index.ts';

export type FwdEditModeName = EditModeName | 'edit';

export interface FeatureEditStartFwdEvent
  extends Pick<GmEditFeatureEditStartEvent, 'actionType' | 'action'> {
  shape: FeatureShape;
  feature: FeatureData;
  map: AnyMapInstance;
}

export interface FeatureEditEndFwdEvent
  extends Pick<GmEditFeatureEditEndEvent, 'actionType' | 'action'> {
  shape: FeatureShape;
  feature: FeatureData;
  map: AnyMapInstance;
}

export type FeatureEditFwdEvent = FeatureEditStartFwdEvent | FeatureEditEndFwdEvent;
