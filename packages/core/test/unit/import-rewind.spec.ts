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
  it('rejects a polygon that turf rewind cannot parse', () => {
    expect(
      fixGeoJsonFeature({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [] },
      }),
    ).toBeNull();
    expect(
      fixGeoJsonFeature({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [null] },
      } as never),
    ).toBeNull();
    expect(
      fixGeoJsonFeature({
        type: 'Feature',
        properties: {},
        geometry: null,
      } as never),
    ).toBeNull();
  });

  it('rejects a feature with a non-finite coordinate', () => {
    expect(
      fixGeoJsonFeature({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, Number.NaN],
              [0, 0],
            ],
          ],
        },
      }),
    ).toBeNull();

    expect(
      fixGeoJsonFeature({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [Number.POSITIVE_INFINITY, 1] },
      }),
    ).toBeNull();
  });

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

    expect(
      fixGeoJsonFeature({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [] },
      }),
    ).toBeNull();
    expect(
      fixGeoJsonFeature({
        type: 'Feature',
        properties: {},
        geometry: { type: 'MultiPolygon', coordinates: [[]] },
      }),
    ).toBeNull();
    expect(
      fixGeoJsonFeature({ type: 'Feature', properties: {}, geometry: null as never }),
    ).toBeNull();

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
