import type { GmControlSwitchEvent } from '@/types/index.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';
import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';

export const isGmControlEvent = (payload: unknown): payload is GmControlSwitchEvent => {
  return isGmEvent(payload) && payload.name === `${GM_SYSTEM_PREFIX}:control:switch`;
};
