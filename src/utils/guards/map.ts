import type { AnyEvent, BaseMapEventName, MapPointerEvent, MapWithOnceMethod, PointerEventName } from '@/main.ts';
import { baseMapEventNames, pointerEvents } from '@/types/map/index.ts';
import log from 'loglevel';


export function isPointerEventName(key: string): key is PointerEventName {
  return pointerEvents.includes(key as PointerEventName);
}

export function isBaseMapEventName(key: string): key is BaseMapEventName {
  return baseMapEventNames.includes(key as BaseMapEventName);
}

export const hasMapOnceMethod = (map: unknown): map is MapWithOnceMethod => {
  return !!(
    map
    && typeof map === 'object'
    && 'once' in map
    && typeof (map as MapWithOnceMethod).once === 'function'
  );
};

export const isMapPointerEvent = (
  event: AnyEvent,
  options: { warning: boolean } = { warning: false },
): event is MapPointerEvent => {
  if (!event) {
    if (options.warning) {
      log.warn('Empty event', event);
    }
    return false;
  }

  const isCursorEvent = (
    typeof event === 'object'
    && 'lngLat' in event
    && 'point' in event
    && 'type' in event
    && 'originalEvent' in event
    && typeof event.type === 'string'
    && pointerEvents.includes(event.type as PointerEventName)
  );

  if (!isCursorEvent && options.warning) {
    log.warn('Not a pointer event', event);
  }

  return isCursorEvent;
};
