import { gmPrefix } from '@/core/events/listeners/base.ts';
import type { GMControlEvent } from '@/types/events/control.ts';
import type { GMDrawEvent } from '@/types/events/draw.ts';
import { type GMEditEvent } from '@/types/events/edit.ts';
import type { GMFeatureEvent } from '@/types/events/feature.ts';
import type { GMHelperEvent } from '@/types/events/helper.ts';
import type { ActionType } from '@/types/options.ts';


export type EventType = ActionType | 'control';
export type EventLevel = 'system' | 'user';
export type NonEmptyArray<T> = [T, ...T[]];

export type GMBaseEvent = {
  level: EventLevel,
  type: EventType,
  action: string,
};

export type GMEvent =
  GMDrawEvent |
  GMEditEvent |
  GMHelperEvent |
  GMControlEvent |
  GMFeatureEvent;

export type GmPrefix = typeof gmPrefix;
export type GmEventNameWithoutPrefix = EventType;
export type GmEventName = `${GmPrefix}:${GmEventNameWithoutPrefix}`;

export type * from '@/types/events/forwarder/index.ts';
export type * from '@/types/events/bus.ts';
export type * from '@/types/events/control.ts';
export type * from '@/types/events/draw.ts';
export type * from '@/types/events/edit.ts';
export type * from '@/types/events/feature.ts';
export type * from '@/types/events/helper.ts';
export type * from '@/types/events/mode.ts';
export { isGmFeatureBeforeUpdateEvent } from '@/utils/guards/events/features.ts';
export { isGmFeatureBeforeCreateEvent } from '@/utils/guards/events/features.ts';
