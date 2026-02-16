import { type MapboxPointerEventName, mapboxPointerEvents } from '@mapLib/types/events.ts';

export const isMapboxSupportedPointerEventName = (
  name: string,
): name is MapboxPointerEventName => {
  return mapboxPointerEvents.includes(name as MapboxPointerEventName);
};
