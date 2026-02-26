import type { MapMouseEvent, MapTouchEvent } from 'mapbox-gl';

// NOTE: Don't use mapbox types directly outside of "packages/mapbox/src/adapter" directory

export const mapboxPointerEvents = [
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

export type MapboxPointerEventName = (typeof mapboxPointerEvents)[number];

export type BaseMapEvent = MapMouseEvent | MapTouchEvent;

export type BaseMapMouseEvent = MapMouseEvent;

export type BaseMapTouchEvent = MapTouchEvent;

export type BaseMapPointerEvent = MapMouseEvent | MapTouchEvent;
