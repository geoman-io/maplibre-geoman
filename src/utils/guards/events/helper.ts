import type { GMGeofencingViolationEvent, GMHelperModeEvent } from '@/main.ts';
import { geofencingViolationActions } from '@/types/events/helper.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';
import { includesWithType } from '@/utils/typing.ts';


export const isGmHelperEvent = (payload: unknown): payload is GMHelperModeEvent => {
  return (
    isGmEvent(payload)
    && payload.type === 'helper'
  );
};

export const isGmGeofencingViolationEvent = (
  payload: unknown,
): payload is GMGeofencingViolationEvent => {
  return (
    isGmHelperEvent(payload)
    && payload.mode === 'geofencing'
    && includesWithType(payload.action, geofencingViolationActions)
  );
};
