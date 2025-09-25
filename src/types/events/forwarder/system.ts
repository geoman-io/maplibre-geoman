import type { Geoman, GmPrefix } from '@/main.ts';
import type { GmControlLoadEvent } from '@/types/events/control.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';
import { GM_PREFIX } from '@/core/constants.ts';
import type { BaseFwdEvent } from '@/types/events/forwarder/base.ts';

export interface GmLoadStateFwdEvent extends BaseFwdEvent<GmControlLoadEvent> {
  type: `${GmPrefix}:${GmControlLoadEvent['action']}`;
  map: AnyMapInstance;
  [GM_PREFIX]: Geoman;
}

export type SystemFwdEvent = GmLoadStateFwdEvent;
