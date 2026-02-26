import { describe, expect, it } from 'vitest';
import { isLngLat } from '@/utils/guards/geojson.ts';

describe('utils/guards/geojson', () => {
  it('validates lng/lat tuples', () => {
    expect(isLngLat([12.5, 55.7])).toBe(true);
    expect(isLngLat([12.5])).toBe(false);
    expect(isLngLat([12.5, 55.7, 8])).toBe(false);
    expect(isLngLat(['12.5', 55.7])).toBe(false);
    expect(isLngLat(null)).toBe(false);
  });
});
