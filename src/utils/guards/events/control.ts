import { controlActions } from '@/types/events/control.ts';
import type { GmControlSwitchEvent } from '@/types/index.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';

export const isGmControlEvent = (payload: unknown): payload is GmControlSwitchEvent => {
  return (
    isGmEvent(payload) &&
    payload.actionType === 'control' &&
    controlActions.includes(payload.action as GmControlSwitchEvent['action'])
  );
};
