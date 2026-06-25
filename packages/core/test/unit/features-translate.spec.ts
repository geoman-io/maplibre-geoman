import area from '@turf/area';
import distance from '@turf/distance';
import type { Feature, Polygon, Position } from 'geojson';
import { describe, expect, it, vi } from 'vitest';

// '@/utils/features.ts' value-imports BaseMapAdapter (pulls in Svelte controls)
// and '@tests/types.ts'; mock both to keep this spec node-only.
vi.mock('@/core/map/base/index.ts', () => ({
  BaseMapAdapter: class {},
}));
vi.mock('@tests/types.ts', () => ({
  isLineBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['LineString', 'MultiLineString'].includes(geoJson?.geometry?.type ?? ''),
  isPointBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['Point', 'MultiPoint'].includes(geoJson?.geometry?.type ?? ''),
}));

import { getTranslatedGeoJson, moveGeoJson } from '@/utils/features.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLatTuple } from '@/types/map/index.ts';

// A tall, narrow polygon spanning 58°–62°N — the latitude band where translating
// with a degree offset shears the shape the most.
const makeTallPolygon = (): Feature<Polygon> => ({
  type: 'Feature',
  properties: { __gm_shape: 'polygon' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [10, 58],
        [10.4, 58],
        [10.4, 62],
        [10, 62],
        [10, 58],
      ],
    ],
  },
});

const ring = (feature: Feature<Polygon>): Position[] => feature.geometry.coordinates[0];

const edgeLengths = (feature: Feature<Polygon>): number[] => {
  const coords = ring(feature);
  const lengths: number[] = [];
  for (let i = 0; i < coords.length - 1; i++) {
    lengths.push(distance(coords[i], coords[i + 1], { units: 'meters' }));
  }
  return lengths;
};

const relErr = (a: number, b: number): number => Math.abs(a - b) / b;

describe('utils/features getTranslatedGeoJson', () => {
  const anchor: LngLatTuple = [10.2, 60];

  // The hard case for a degree offset: a drag with a large north/south component.
  describe.each<[string, LngLatTuple]>([
    ['north', [10.2, 61]],
    ['diagonal', [11.5, 61]],
    ['east', [11.5, 60]],
  ])('dragging %s', (_label, target) => {
    it('preserves every edge length at ~60°N', () => {
      const before = edgeLengths(makeTallPolygon());
      const moved = getTranslatedGeoJson(
        makeTallPolygon() as GeoJsonShapeFeature,
        anchor,
        target,
      ) as Feature<Polygon>;
      const after = edgeLengths(moved);

      expect(after).toHaveLength(before.length);
      after.forEach((len, i) => expect(relErr(len, before[i])).toBeLessThan(0.001));
    });

    it('preserves area', () => {
      const before = area(makeTallPolygon());
      const moved = getTranslatedGeoJson(makeTallPolygon() as GeoJsonShapeFeature, anchor, target);
      expect(relErr(area(moved as Feature<Polygon>), before)).toBeLessThan(0.001);
    });

    it('actually moves the polygon (anchor lands on the target)', () => {
      const moved = getTranslatedGeoJson(
        makeTallPolygon() as GeoJsonShapeFeature,
        anchor,
        target,
      ) as Feature<Polygon>;
      // The polygon's centroid-ish first vertex should have shifted toward target.
      expect(ring(moved)[0]).not.toEqual([10, 58]);
    });
  });

  it('fixes the distortion the legacy degree-offset translation introduces', () => {
    // Pure north drag — where adding a constant (Δlng, Δlat) to every vertex
    // shears the shape because parallels shrink toward the pole.
    const target: LngLatTuple = [10.2, 61];
    const before = area(makeTallPolygon());

    const naive = moveGeoJson(makeTallPolygon() as GeoJsonShapeFeature, {
      lng: target[0] - anchor[0],
      lat: target[1] - anchor[1],
    });
    const geodesic = getTranslatedGeoJson(makeTallPolygon() as GeoJsonShapeFeature, anchor, target);

    const naiveError = relErr(area(naive as Feature<Polygon>), before);
    const geodesicError = relErr(area(geodesic as Feature<Polygon>), before);

    expect(naiveError).toBeGreaterThan(0.01); // legacy distorts (~3% here)
    expect(geodesicError).toBeLessThan(0.001); // reconstruction holds the shape
  });

  it('is deterministic: output depends only on the geographic inputs', () => {
    // No map/projection argument is involved, so globe and mercator views feed the
    // same anchor/target and get byte-identical geometry.
    const target: LngLatTuple = [11.5, 61];
    const a = getTranslatedGeoJson(makeTallPolygon() as GeoJsonShapeFeature, anchor, target);
    const b = getTranslatedGeoJson(makeTallPolygon() as GeoJsonShapeFeature, anchor, target);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('treats a zero-length drag as a no-op (no NaN from an undefined bearing)', () => {
    const original = makeTallPolygon();
    const moved = getTranslatedGeoJson(original as GeoJsonShapeFeature, anchor, anchor);
    expect(moved.geometry).toEqual(original.geometry);
  });

  it('preserves feature properties through the translation', () => {
    const moved = getTranslatedGeoJson(
      makeTallPolygon() as GeoJsonShapeFeature,
      anchor,
      [11.5, 61],
    );
    expect(moved.properties).toEqual({ __gm_shape: 'polygon' });
  });
});
