import type { GMBeforeFeatureCreateEvent, GMBeforeFeatureUpdateEvent } from '@/main.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';


export const isGmFeatureBeforeCreateEvent = (
  payload: unknown,
): payload is GMBeforeFeatureCreateEvent => {
  return (
    isGmEvent(payload)
    && payload.action === 'before_create'
  );
};

export const isGmFeatureBeforeUpdateEvent = (
  payload: unknown,
): payload is GMBeforeFeatureUpdateEvent => {
  return (
    isGmEvent(payload)
    && payload.action === 'before_update'
  );
};
