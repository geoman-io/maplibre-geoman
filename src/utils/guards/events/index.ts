import type { GmBaseModeEvent, GmEvent } from '@/main.ts';
import { modeActions } from '@/types/events/mode.ts';
import { includesWithType } from '@/utils/typing.ts';

export const isGmEvent = (payload: unknown): payload is GmEvent => {
  const fields: Array<keyof GmEvent> = ['level', 'actionType', 'action'];

  return !!(
    payload &&
    typeof payload === 'object' &&
    fields.every((fieldName) => fieldName in payload)
  );
};

export const isGmModeEvent = (payload: unknown): payload is GmBaseModeEvent => {
  return isGmEvent(payload) && includesWithType(payload.action, modeActions);
};
export { isGmControlEvent } from '@/utils/guards/events/control.ts';
