import type { GmGeofencingViolationEvent, GmHelperModeEvent } from '@/main.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';
import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';

export const isGmHelperEvent = (payload: unknown): payload is GmHelperModeEvent => {
  return isGmEvent(payload) && payload.actionType === 'helper';
};

export const isGmGeofencingViolationEvent = (
  payload: unknown,
): payload is GmGeofencingViolationEvent => {
  return isGmEvent(payload) && payload.name === `${GM_SYSTEM_PREFIX}:helper:geofencing_violation`;
};
