import type { LngLat } from '@/types';

export const isLngLat = (value: unknown): value is LngLat => {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number'
  );
};
