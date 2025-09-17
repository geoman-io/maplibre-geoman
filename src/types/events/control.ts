import type { ModeName } from '@/types/controls.ts';
import { type GmBaseEvent } from '@/types/events/index.ts';
import type { ModeType } from '@/types/options.ts';

export const controlActions = ['on', 'off'] as const;

export interface GmControlSwitchEvent extends GmBaseEvent {
  actionType: 'control';
  action: (typeof controlActions)[number];
  section: ModeType;
  target: ModeName;
}

export interface GmControlLoadEvent extends GmBaseEvent {
  actionType: 'control';
  action: 'loaded' | 'unloaded';
}

export type GmControlEvent = GmControlSwitchEvent | GmControlLoadEvent;
