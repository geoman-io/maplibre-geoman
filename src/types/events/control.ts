import type { ModeName } from '@/types/controls.ts';
import { type GMBaseEvent } from '@/types/events/index.ts';
import type { ActionType } from '@/types/options.ts';


export const controlActions = ['on', 'off'] as const;

export interface GMControlSwitchEvent extends GMBaseEvent {
  type: 'control',
  action: typeof controlActions[number];
  section: ActionType,
  target: ModeName,
}

export interface GMControlLoadEvent extends GMBaseEvent {
  type: 'control',
  action: 'loaded' | 'unloaded';
}

export type GMControlEvent = GMControlSwitchEvent | GMControlLoadEvent;
