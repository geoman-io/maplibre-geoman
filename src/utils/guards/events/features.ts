import type { GmFeatureBeforeCreateEvent, GmFeatureBeforeUpdateEvent } from '@/main.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';
import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';

export const isGmFeatureBeforeCreateEvent = (
  payload: unknown,
): payload is GmFeatureBeforeCreateEvent => {
  return isGmEvent(payload) && payload.name === `${GM_SYSTEM_PREFIX}:feature:before_create`;
};

export const isGmFeatureBeforeUpdateEvent = (
  payload: unknown,
): payload is GmFeatureBeforeUpdateEvent => {
  return isGmEvent(payload) && payload.name === `${GM_SYSTEM_PREFIX}:feature:before_update`;
};
