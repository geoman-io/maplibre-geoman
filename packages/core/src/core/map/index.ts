import type { AnyMapInstance, Geoman } from '@/main.ts';
import { MapAdapter } from '@mapLib/index.ts';

export const getMapAdapter = (gm: Geoman, map: AnyMapInstance) => {
  return new MapAdapter(map as ConstructorParameters<typeof MapAdapter>[0], gm);
};
