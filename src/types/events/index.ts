import { GM_PREFIX, GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import type { GmControlEvent } from '@/types/events/control.ts';
import type { GmDrawEvent } from '@/types/events/draw.ts';
import { type GmEditEvent } from '@/types/events/edit.ts';
import type { GmFeatureEvent } from '@/types/events/feature.ts';
import type { GmHelperEvent } from '@/types/events/helper.ts';
import type { GmFwdEvent } from '@/types/index.ts';
import type { ActionType } from '@/types/options.ts';
import type { BaseMapAnyEvent } from '@mapLib/types/events.ts';

export type EventLevel = 'system' | 'user';
export type NonEmptyArray<T> = [T, ...T[]];

export type GmBaseEvent = {
  level: EventLevel;
  name: string;
  actionType: ActionType;
  action: string;
};

export type GmEvent = GmDrawEvent | GmEditEvent | GmHelperEvent | GmControlEvent | GmFeatureEvent;
export type AnyEvent = GmEvent | GmFwdEvent | BaseMapAnyEvent;

export type GmPrefix = typeof GM_PREFIX;
export type GmSystemPrefix = typeof GM_SYSTEM_PREFIX;
export type GmEventNameWithoutPrefix = ActionType;
export type GmEventName = `${GmSystemPrefix}:${GmEventNameWithoutPrefix}`;

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
