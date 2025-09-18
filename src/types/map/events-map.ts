import type { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import type { AnyEvent, GmControlEvent, GmDrawEvent, GmEditEvent, GmHelperEvent } from '@/types';

type DrawEventsMap = Record<`${typeof GM_SYSTEM_PREFIX}:draw`, GmDrawEvent>;
type EditEventsMap = Record<`${typeof GM_SYSTEM_PREFIX}:edit`, GmEditEvent>;
type HelperEventsMap = Record<`${typeof GM_SYSTEM_PREFIX}:helper`, GmHelperEvent>;
type ControlEventsMap = Record<`${typeof GM_SYSTEM_PREFIX}:control`, GmControlEvent>;

export type EventsMap = DrawEventsMap & EditEventsMap & HelperEventsMap & ControlEventsMap;
export type EventFor<T extends string> = T extends keyof EventsMap ? EventsMap[T] : AnyEvent;
