import type { Geoman, MapInstanceWithGeoman } from '@/main.ts';
import { MapAdapter } from '@mapLib/index.ts';

export const getMapAdapter = (gm: Geoman, map: MapInstanceWithGeoman) => {
  return new MapAdapter(map, gm);
};
