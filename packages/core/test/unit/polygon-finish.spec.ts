import { describe, expect, it } from 'vitest';
import { preparePolygonFinish } from '@/utils/polygon-finish.ts';

const square = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
] as Array<[number, number]>;

describe('preparePolygonFinish', () => {
  it('refuses a two-vertex close and a zero-area ring', () => {
    expect(
      preparePolygonFinish(
        [
          [0, 0],
          [1, 0],
          [0, 0],
        ],
        { selfIntersection: 'split', asPolygon: false },
      ),
    ).toEqual({ ok: false, reason: 'too_few_vertices' });

    expect(
      preparePolygonFinish(
        [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
        { selfIntersection: 'split', asPolygon: false },
      ),
    ).toEqual({ ok: false, reason: 'zero_area' });
  });

  it('splits a crossing ring by default and can reject it', () => {
    const bowtie = [
      [0, 0],
      [1, 1],
      [1, 0],
      [0, 1],
    ] as Array<[number, number]>;

    const split = preparePolygonFinish(bowtie, { selfIntersection: 'split', asPolygon: false });
    expect(split.ok).toBe(true);
    if (split.ok) {
      expect(split.feature.geometry.type).toBe('MultiPolygon');
    }

    expect(preparePolygonFinish(bowtie, { selfIntersection: 'reject', asPolygon: false })).toEqual({
      ok: false,
      reason: 'self_intersection',
    });
  });

  it('keeps a one-part MultiPolygon unless asPolygon is set', () => {
    const split = preparePolygonFinish(square, { selfIntersection: 'split', asPolygon: false });
    expect(split.ok).toBe(true);
    if (split.ok) {
      expect(split.feature.geometry.type).toBe('MultiPolygon');
    }

    const single = preparePolygonFinish(square, { selfIntersection: 'split', asPolygon: true });
    expect(single.ok).toBe(true);
    if (single.ok) {
      expect(single.feature.geometry.type).toBe('Polygon');
    }
  });
});
