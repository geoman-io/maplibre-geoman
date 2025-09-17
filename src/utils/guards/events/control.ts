import { controlActions } from '@/types/events/control.ts';
import type { GMControlSwitchEvent } from '@/types/index.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';

export const isGmControlEvent = (payload: unknown): payload is GMControlSwitchEvent => {
  return (
    isGmEvent(payload) &&
    payload.type === 'control' &&
    controlActions.includes(payload.action as GMControlSwitchEvent['action'])
  );
};
