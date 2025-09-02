import { FeatureData } from '@/core/features/feature-data.ts';
import type { FeatureShape } from '@/types/features.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';

import type { EditModeName } from '@/types/modes/index.ts';

export type FwdEditModeName = EditModeName | 'edit';

export interface FeatureEditStartFwdEvent {
  shape: FeatureShape;
  feature: FeatureData;
  map: AnyMapInstance;
}

export type FeatureEditEndFwdEvent = FeatureEditStartFwdEvent;

export type FeatureEditFwdEvent = FeatureEditStartFwdEvent | FeatureEditEndFwdEvent;
