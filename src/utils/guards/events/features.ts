import type { GmBeforeFeatureCreateEvent, GmBeforeFeatureUpdateEvent } from '@/main.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';

export const isGmFeatureBeforeCreateEvent = (
  payload: unknown,
): payload is GmBeforeFeatureCreateEvent => {
  return isGmEvent(payload) && payload.action === 'before_create';
};

export const isGmFeatureBeforeUpdateEvent = (
  payload: unknown,
): payload is GmBeforeFeatureUpdateEvent => {
  return isGmEvent(payload) && payload.action === 'before_update';
};
