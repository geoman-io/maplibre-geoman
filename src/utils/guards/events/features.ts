import type { GmFeatureBeforeCreateEvent, GmFeatureBeforeUpdateEvent } from '@/main.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';

export const isGmFeatureBeforeCreateEvent = (
  payload: unknown,
): payload is GmFeatureBeforeCreateEvent => {
  return isGmEvent(payload) && payload.action === 'before_create';
};

export const isGmFeatureBeforeUpdateEvent = (
  payload: unknown,
): payload is GmFeatureBeforeUpdateEvent => {
  return isGmEvent(payload) && payload.action === 'before_update';
};
