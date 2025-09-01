import type {
  GMDrawEvent,
  GMDrawFreehandDrawerEvent,
  GMDrawFreehandDrawerEventWithData,
  GMDrawLineDrawerEvent,
  GMDrawLineDrawerEventWithData,
  GMDrawShapeEvent,
  GMDrawShapeEventWithData,
} from '@/types/index.ts';
import { isGmEvent } from '@/utils/guards/events/index.ts';

export const isGmDrawEvent = (payload: unknown): payload is GMDrawEvent => {
  return isGmEvent(payload) && payload.type === 'draw';
};

export const isGmDrawShapeEvent = (
  payload: unknown,
): payload is GMDrawShapeEvent | GMDrawShapeEventWithData => {
  return (
    isGmEvent(payload) &&
    payload.type === 'draw' &&
    'variant' in payload &&
    payload.variant === null
  );
};

export const isGmDrawLineDrawerEvent = (
  payload: unknown,
): payload is GMDrawLineDrawerEvent | GMDrawLineDrawerEventWithData => {
  return (
    isGmEvent(payload) &&
    payload.type === 'draw' &&
    'variant' in payload &&
    payload.variant === 'line_drawer'
  );
};

export const isGmDrawFreehandDrawerEvent = (
  payload: unknown,
): payload is GMDrawFreehandDrawerEvent | GMDrawFreehandDrawerEventWithData => {
  return (
    isGmEvent(payload) &&
    payload.type === 'draw' &&
    'variant' in payload &&
    payload.variant === 'freehand_drawer'
  );
};
