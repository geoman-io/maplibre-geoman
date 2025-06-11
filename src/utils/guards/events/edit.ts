import type { GMEditEvent } from '@/types/index.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';

export const isGmEditEvent = (payload: unknown): payload is GMEditEvent => {
  return (
    isGmEvent(payload)
    && payload.type === 'edit'
  );
};
