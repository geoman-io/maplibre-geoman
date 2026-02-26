import type { GmBaseEvent } from '@/types/events/index.ts';

export const modeActions = ['mode_start', 'mode_started', 'mode_end', 'mode_ended'] as const;

export type ModeAction = (typeof modeActions)[number];

export interface GmBaseModeEvent extends GmBaseEvent {
  action: ModeAction;
}
