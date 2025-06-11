import type { GmBaseModeEvent, GMEvent } from '@/main.ts';
import { modeActions } from '@/types/events/mode.ts';
import { includesWithType } from '@/utils/typing.ts';


export const isGmEvent = (payload: unknown): payload is GMEvent => {
  return !!(
    payload
    && typeof payload === 'object'
    && 'level' in payload
    && 'type' in payload
    && 'action' in payload
  );
};

export const isGmModeEvent = (payload: unknown): payload is GmBaseModeEvent => {
  return (
    isGmEvent(payload)
    && includesWithType(payload.action, modeActions)
  );
};
export { isGmControlEvent } from '@/utils/guards/events/control.ts';
