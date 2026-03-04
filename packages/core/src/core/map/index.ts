import type { Geoman } from '@/main.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';
import { MapAdapter } from '@mapLib/index.ts';

export const getMapAdapter = (gm: Geoman, map: AnyMapInstance) => {
  return new MapAdapter(map as ConstructorParameters<typeof MapAdapter>[0], gm);
};
