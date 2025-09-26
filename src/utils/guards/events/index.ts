import type { GmBaseModeEvent, GmSystemEvent } from '@/main.ts';
import { modeActions } from '@/types/events/mode.ts';
import { includesWithType } from '@/utils/typing.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';

export const isGmEvent = (payload: unknown): payload is GmSystemEvent => {
  const fields: Array<keyof GmSystemEvent> = ['level', 'actionType', 'action'];

  return !!(
    payload &&
    typeof payload === 'object' &&
    fields.every((fieldName) => fieldName in payload)
  );
};

export const isBaseMapEvent = (payload: unknown): payload is BaseMapEvent => {
  const fields: Array<keyof BaseMapEvent> = ['type', 'originalEvent', 'target'];

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
