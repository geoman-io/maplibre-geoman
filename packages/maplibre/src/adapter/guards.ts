import { type MaplibrePointerEventName, maplibrePointerEvents } from '@mapLib/types/events.ts';

export const isMaplibreSupportedPointerEventName = (
  name: string,
): name is MaplibrePointerEventName => {
  return maplibrePointerEvents.includes(name as MaplibrePointerEventName);
};
