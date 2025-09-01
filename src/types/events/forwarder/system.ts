import type { Geoman } from '@/main.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';
import { GM_PREFIX } from '@/core/constants.ts';

export interface GmLoadedFwdEvent {
  map: AnyMapInstance;
  [GM_PREFIX]: Geoman;
}

export type SystemFwdEvent = GmLoadedFwdEvent;
