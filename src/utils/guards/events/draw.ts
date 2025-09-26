import type {
  GmDrawEvent,
  GmDrawFreehandDrawerEvent,
  GmDrawFreehandDrawerEventWithData,
  GmDrawLineDrawerEvent,
  GmDrawLineDrawerEventWithData,
  GmDrawShapeEvent,
  GmDrawShapeEventWithData,
} from '@/types/index.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';
import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';

export const isGmDrawEvent = (payload: unknown): payload is GmDrawEvent => {
  return isGmEvent(payload) && payload.actionType === 'draw';
};

export const isGmDrawShapeEvent = (
  payload: unknown,
): payload is GmDrawShapeEvent | GmDrawShapeEventWithData => {
  return (
    isGmEvent(payload) &&
    (payload.name === `${GM_SYSTEM_PREFIX}:draw:shape` ||
      payload.name === `${GM_SYSTEM_PREFIX}:draw:shape_with_data`)
  );
};

export const isGmDrawLineDrawerEvent = (
  payload: unknown,
): payload is GmDrawLineDrawerEvent | GmDrawLineDrawerEventWithData => {
  return isGmDrawShapeEvent(payload) && payload.variant === 'line_drawer';
};

export const isGmDrawFreehandDrawerEvent = (
  payload: unknown,
): payload is GmDrawFreehandDrawerEvent | GmDrawFreehandDrawerEventWithData => {
  return isGmDrawShapeEvent(payload) && payload.variant === 'freehand_drawer';
};
