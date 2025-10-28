import type {
  BaseMapEventName,
  MapWithOnceMethod,
  PartialLayerStyle,
  PointerEventName,
} from '@/main.ts';
import { baseMapEventNames, pointerEvents } from '@/types/map/index.ts';
import type { BaseMapEvent, BaseMapMouseEvent, BaseMapPointerEvent } from '@mapLib/types/events.ts';
import log from 'loglevel';

export function isPointerEventName(key: string): key is PointerEventName {
  return pointerEvents.includes(key as PointerEventName);
}

export function isBaseMapEventName(key: string): key is BaseMapEventName {
  return baseMapEventNames.includes(key as BaseMapEventName);
}

export const isMapWithOnceMethod = (map: unknown): map is MapWithOnceMethod => {
  return !!(
    map &&
    typeof map === 'object' &&
    'once' in map &&
    typeof (map as MapWithOnceMethod).once === 'function'
  );
};

export const isMapPointerEvent = (
  event: BaseMapEvent,
  options: { warning: boolean } = { warning: false },
): event is BaseMapPointerEvent => {
  if (!event) {
    if (options.warning) {
      log.warn('Empty event', event);
    }
    return false;
  }

  const isCursorEvent =
    typeof event === 'object' &&
    'lngLat' in event &&
    'point' in event &&
    'type' in event &&
    'originalEvent' in event &&
    typeof event.type === 'string' &&
    pointerEvents.includes(event.type as PointerEventName);

  if (!isCursorEvent && options.warning) {
    log.warn('Not a pointer event', event);
  }

  return isCursorEvent;
};

export const isMapMouseEvent = (
  event: BaseMapEvent,
  options: { warning: boolean } = { warning: false },
): event is BaseMapMouseEvent => {
  return isMapPointerEvent(event, options) && !event.type.startsWith('touch');
};

export const isMapTouchEvent = (
  event: BaseMapEvent,
  options: { warning: boolean } = { warning: false },
): event is BaseMapMouseEvent => {
  return isMapPointerEvent(event, options) && event.type.startsWith('touch');
};

export const isPointerEventWithModifiers = (event: BaseMapPointerEvent) => {
  return (
    event.originalEvent.ctrlKey ||
    event.originalEvent.shiftKey ||
    event.originalEvent.altKey ||
    event.originalEvent.metaKey
  );
};

export const isPartialLayer = (object: unknown): object is PartialLayerStyle => {
  const allowedTypes = ['symbol', 'fill', 'line', 'circle'] as const satisfies Array<
    PartialLayerStyle['type']
  >;

  return (
    !!object &&
    typeof object === 'object' &&
    'type' in object &&
    allowedTypes.includes(object.type as PartialLayerStyle['type'])
  );
};
