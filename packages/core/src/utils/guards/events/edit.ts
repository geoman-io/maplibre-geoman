import type { GmEditEvent } from '@/types/index.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';

export const isGmEditEvent = (payload: unknown): payload is GmEditEvent => {
  return isGmEvent(payload) && payload.actionType === 'edit';
};
