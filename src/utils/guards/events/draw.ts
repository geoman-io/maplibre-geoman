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

export const isGmDrawEvent = (payload: unknown): payload is GmDrawEvent => {
  return isGmEvent(payload) && payload.actionType === 'draw';
};

export const isGmDrawShapeEvent = (
  payload: unknown,
): payload is GmDrawShapeEvent | GmDrawShapeEventWithData => {
  return (
    isGmEvent(payload) &&
    payload.actionType === 'draw' &&
    'variant' in payload &&
    payload.variant === null
  );
};

export const isGmDrawLineDrawerEvent = (
  payload: unknown,
): payload is GmDrawLineDrawerEvent | GmDrawLineDrawerEventWithData => {
  return (
    isGmEvent(payload) &&
    payload.actionType === 'draw' &&
    'variant' in payload &&
    payload.variant === 'line_drawer'
  );
};

export const isGmDrawFreehandDrawerEvent = (
  payload: unknown,
): payload is GmDrawFreehandDrawerEvent | GmDrawFreehandDrawerEventWithData => {
  return (
    isGmEvent(payload) &&
    payload.actionType === 'draw' &&
    'variant' in payload &&
    payload.variant === 'freehand_drawer'
  );
};
