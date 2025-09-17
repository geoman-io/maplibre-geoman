import type { Geoman } from '@/main.ts';
import type { GmControlLoadEvent } from '@/types/events/control.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';
import { GM_PREFIX } from '@/core/constants.ts';

export interface GmLoadedFwdEvent extends Pick<GmControlLoadEvent, 'actionType' | 'action'> {
  map: AnyMapInstance;
  [GM_PREFIX]: Geoman;
}

export type SystemFwdEvent = GmLoadedFwdEvent;
