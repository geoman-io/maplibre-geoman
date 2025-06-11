import { gmPrefix } from '@/core/events/listeners/base.ts';
import type { Geoman } from '@/main.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';


export interface GmLoadedFwdEvent {
  map: AnyMapInstance,
  [gmPrefix]: Geoman,
}

export type SystemFwdEvent = GmLoadedFwdEvent;
