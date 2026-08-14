import { type MaplibrePointerEventName, maplibrePointerEvents } from '@mapLib/types/events.ts';
import type * as ml from 'maplibre-gl';

export const isMaplibreSupportedPointerEventName = (
  name: string,
): name is MaplibrePointerEventName => {
  return maplibrePointerEvents.includes(name as MaplibrePointerEventName);
};

/**
 * Geoman runs its own event bus on top of the map's `Evented` instance: it fires and
 * subscribes to custom `gm:*` names (see `core/events/bus.ts` and `core/events/forwarder.ts`)
 * alongside MapLibre's built-in ones.
 *
 * MapLibre GL JS v5 typed `Map.on/once/off` as `keyof MapEventType | string`, which allowed
 * this. v6 narrowed it to `keyof MapEventType`, so the custom names no longer type-check even
 * though `Evented` still dispatches any string at runtime.
 *
 * This cast keeps that (still working) behaviour compiling. It is deliberately isolated here so
 * the assumption is visible in one place: if MapLibre ever stops dispatching unknown event names,
 * this is the call site that breaks, and geoman needs its own emitter instead of the map's.
 */
export const asMaplibreEventName = (name: string) => name as keyof ml.MapEventType;
