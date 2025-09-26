import type { MapLayerEventType, MapLibreEvent, MapMouseEvent, MapTouchEvent } from 'maplibre-gl';

// NOTE: Don't use maplibre types directly outside of "core/map/maplibre" directory

export const maplibrePointerEvents: ReadonlyArray<keyof MapLayerEventType> = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseenter',
  'mouseleave',
  'mouseover',
  'mouseout',
  'contextmenu',
  'touchstart',
  'touchend',
  'touchcancel',
] as const;

export type MaplibrePointerEventName = (typeof maplibrePointerEvents)[number];

export type BaseMapEvent = MapLibreEvent;

export type BaseMapMouseEvent = MapMouseEvent;

export type BaseMapTouchEvent = MapTouchEvent;

export type BaseMapPointerEvent = MapMouseEvent | MapTouchEvent;
