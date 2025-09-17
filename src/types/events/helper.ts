import { type GmBaseEvent } from '@/types/events/index.ts';
import type { GmBaseModeEvent } from '@/types/events/mode.ts';

import type { HelperModeName } from '@/types/modes/index.ts';
import type { ActionType } from '@/types/options.ts';

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
  actionType: ActionType;
  action: (typeof geofencingViolationActions)[number];
}

export type GmHelperEvent = GmHelperModeEvent | GmGeofencingViolationEvent;
