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

    // Identical latitudes, but spherical area is a non-zero residue (#266).
    expect(
      preparePolygonFinish(
        [
          [-0.00858306884865101, 0.004291534420332255],
          [-0.00429153442507868, 0.004291534420332255],
          [-7.673861546209082e-13, 0.004291534420332255],
        ],
        { selfIntersection: 'reject', asPolygon: true },
      ),
    ).toEqual({ ok: false, reason: 'zero_area' });
  });

  it('keeps a thin triangle that is not collinear', () => {
    const thin = preparePolygonFinish(
      [
        [0, 0],
        [0.01, 0],
        [0.005, 0.000001],
      ],
      { selfIntersection: 'reject', asPolygon: true },
    );
    expect(thin.ok).toBe(true);
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
