import type { Geoman, MapInstanceWithGeoman } from '@/main.ts';
import { MaplibreAdapter } from '@/core/map/maplibre/index.ts';

export const getMapAdapter = (gm: Geoman, map: MapInstanceWithGeoman) => {
  return new MaplibreAdapter(map, gm);
};
