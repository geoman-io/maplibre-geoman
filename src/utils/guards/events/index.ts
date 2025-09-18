import type { GmBaseModeEvent, GmEvent } from '@/main.ts';
import { modeActions } from '@/types/events/mode.ts';
import { includesWithType } from '@/utils/typing.ts';
import type { BaseMapAnyEvent } from '@mapLib/types/events.ts';

export const isGmEvent = (payload: unknown): payload is GmEvent => {
  const fields: Array<keyof GmEvent> = ['level', 'actionType', 'action'];

  return !!(
    payload &&
    typeof payload === 'object' &&
    fields.every((fieldName) => fieldName in payload)
  );
};

export const isBaseMapEvent = (payload: unknown): payload is BaseMapAnyEvent => {
  const fields: Array<keyof BaseMapAnyEvent> = ['type', 'originalEvent', 'target'];

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
