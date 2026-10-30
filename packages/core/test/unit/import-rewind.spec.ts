import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/map/base/index.ts', () => ({
  BaseMapAdapter: class {},
}));

vi.mock('@tests/types.ts', () => ({
  isLineBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'].includes(
      geoJson?.geometry?.type ?? '',
    ),
  isPointBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['Point', 'MultiPoint'].includes(geoJson?.geometry?.type ?? ''),
}));

import { fixGeoJsonFeature } from '@/utils/features.ts';

describe('fixGeoJsonFeature winding', () => {
  it('keeps LineString coordinate order', () => {
    const feature = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          [30, 10],
          [20, 5],
          [10, 0],
        ],
      },
    };

    expect(fixGeoJsonFeature(feature)?.geometry.coordinates).toEqual(feature.geometry.coordinates);
  });

  it('rewinds a clockwise polygon ring to counter-clockwise', () => {
    const feature = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [0, 0],
            [0, 10],
            [10, 10],
            [10, 0],
            [0, 0],
          ],
        ],
      },
    };

    expect(fixGeoJsonFeature(feature)?.geometry.coordinates).toEqual([
      [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
        [0, 0],
      ],
    ]);
  });
});
