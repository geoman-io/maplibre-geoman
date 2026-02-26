import type { GmSystemEvent } from '@/main.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';

export const isGmEvent = (payload: unknown): payload is GmSystemEvent => {
  const fields: Array<keyof GmSystemEvent> = ['level', 'name', 'actionType', 'action'];

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

export { isGmControlEvent } from '@/utils/guards/events/control.ts';
