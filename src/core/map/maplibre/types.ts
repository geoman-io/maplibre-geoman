import ml, { type MapLayerEventType } from 'maplibre-gl';

// NOTE: these types mustn't be used outside the maplibre adapter directory!

export type MaplibreAnyLayer = NonNullable<ReturnType<ml.Map['getLayer']>>;
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
