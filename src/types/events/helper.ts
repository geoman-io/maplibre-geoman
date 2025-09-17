import { type GmBaseEvent } from '@/types/events/index.ts';
import type { GmBaseModeEvent } from '@/types/events/mode.ts';
import type { HelperModeName } from '@/types/modes/index.ts';

export interface GmHelperModeEvent extends GmBaseModeEvent {
  actionType: 'helper';
  mode: HelperModeName;
}

export const geofencingViolationActions = [
  'intersection_violation',
  'containment_violation',
] as const;

export interface GmGeofencingViolationEvent extends GmBaseEvent {
  mode: 'geofencing';
  actionType: 'draw' | 'edit';
  action: (typeof geofencingViolationActions)[number];
}

export type GmHelperEvent = GmHelperModeEvent | GmGeofencingViolationEvent;
