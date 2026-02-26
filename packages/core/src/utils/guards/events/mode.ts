import { type GmBaseModeEvent } from '@/types/index.ts';
import { modeActions } from '@/types/events/mode.ts';
import { includesWithType } from '@/utils/typing.ts';
import { isGmEvent } from '@/utils/guards/index.ts';

export const isGmModeEvent = (payload: unknown): payload is GmBaseModeEvent => {
  return isGmEvent(payload) && includesWithType(payload.action, modeActions);
};
