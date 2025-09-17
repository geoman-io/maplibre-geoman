import type { GmGeofencingViolationEvent, GmHelperModeEvent } from '@/main.ts';
import { geofencingViolationActions } from '@/types/events/helper.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';
import { includesWithType } from '@/utils/typing.ts';

export const isGmHelperEvent = (payload: unknown): payload is GmHelperModeEvent => {
  return isGmEvent(payload) && payload.actionType === 'helper';
};

export const isGmGeofencingViolationEvent = (
  payload: unknown,
): payload is GmGeofencingViolationEvent => {
  return (
    isGmHelperEvent(payload) &&
    payload.mode === 'geofencing' &&
    includesWithType(payload.action, geofencingViolationActions)
  );
};
