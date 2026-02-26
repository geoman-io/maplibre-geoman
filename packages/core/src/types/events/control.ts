import type { ModeName } from '@/types/controls.ts';
import { type GmBaseEvent, type GmSystemPrefix } from '@/types/events/index.ts';
import type { ModeType } from '@/types/options.ts';

export const controlActions = ['on', 'off'] as const;

export interface GmControlSwitchEvent extends GmBaseEvent {
  name: `${GmSystemPrefix}:control:switch`;
  actionType: 'control';
  action: (typeof controlActions)[number];
  section: ModeType;
  mode: ModeName;
}

export interface GmControlLoadEvent extends GmBaseEvent {
  name: `${GmSystemPrefix}:control:load`;
  actionType: 'control';
  action: 'loaded' | 'unloaded';
}

export type GmControlEvent = GmControlSwitchEvent | GmControlLoadEvent;
