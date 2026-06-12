import { describe, expect, it, vi } from 'vitest';

// the helper import chain value-imports Geoman and BaseMapAdapter, which pull
// in the Svelte controls; mock them to keep this spec node-only
vi.mock('@/main.ts', () => ({
  Geoman: class {},
}));
vi.mock('@/core/map/base/index.ts', () => ({
  BaseMapAdapter: class {},
}));
vi.mock('@tests/types.ts', () => ({
  isLineBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['LineString', 'MultiLineString'].includes(geoJson?.geometry?.type ?? ''),
  isPointBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['Point', 'MultiPoint'].includes(geoJson?.geometry?.type ?? ''),
}));

import { ShapeMarkersHelper } from '@/modes/helpers/shape-markers.ts';

const createHelper = () => Object.create(ShapeMarkersHelper.prototype) as ShapeMarkersHelper;

const allowedIndexes = (
  helper: ShapeMarkersHelper,
  shape: 'circle' | 'ellipse',
  verticesCount: number,
) => {
  const result: number[] = [];
  for (let index = 0; index < verticesCount; index += 1) {
    if (helper.isMarkerIndexAllowed(shape, index, verticesCount)) {
      result.push(index);
    }
  }
  return result;
};

describe('modes/helpers/shape-markers isMarkerIndexAllowed', () => {
  it('keeps the four rim markers for the default 80-step circle', () => {
    const helper = createHelper();
    expect(allowedIndexes(helper, 'circle', 80)).toEqual([10, 30, 50, 70]);
  });

  it('provides four rim markers for circles with a non-multiple-of-8 segment count', () => {
    const helper = createHelper();
    expect(allowedIndexes(helper, 'circle', 60)).toHaveLength(4);
    expect(allowedIndexes(helper, 'circle', 42)).toHaveLength(4);
  });

  it('keeps the four axis markers for the default 80-step ellipse', () => {
    const helper = createHelper();
    expect(allowedIndexes(helper, 'ellipse', 80)).toEqual([0, 20, 40, 60]);
  });

  it('does not produce NaN comparisons for tiny rings', () => {
    const helper = createHelper();
    expect(allowedIndexes(helper, 'circle', 3).length).toBeGreaterThan(0);
    expect(allowedIndexes(helper, 'ellipse', 3).length).toBeGreaterThan(0);
  });

  it('allows all marker indexes for non-elliptic shapes', () => {
    const helper = createHelper();
    expect(helper.isMarkerIndexAllowed('polygon', 7, 9)).toBe(true);
  });
});
