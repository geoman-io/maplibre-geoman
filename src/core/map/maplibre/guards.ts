import { type MaplibrePointerEventName, maplibrePointerEvents } from '@/core/map/maplibre/types.ts';

export const isMaplibreSupportedPointerEventName = (
  name: string,
): name is MaplibrePointerEventName => {
  return maplibrePointerEvents.includes(name as MaplibrePointerEventName);
};
