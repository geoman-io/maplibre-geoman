import type { Feature, LineString, MultiPolygon, Polygon, Position } from 'geojson';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/core/map/base/index.ts', () => ({ BaseMapAdapter: class {} }));
vi.mock('@tests/types.ts', () => ({
  isLineBasedGeoJsonFeature: (feature: Feature) =>
    ['LineString', 'MultiLineString'].includes(feature.geometry.type),
  isPointBasedGeoJsonFeature: (feature: Feature) =>
    ['Point', 'MultiPoint'].includes(feature.geometry.type),
}));

import { getTranslatedGeoJson, moveGeoJson } from '@/utils/features.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLatTuple } from '@/types/map/index.ts';

type Fixture = Feature<Polygon | MultiPolygon | LineString>;

const makeFixture = (type: Fixture['geometry']['type'], altitude?: number): Fixture => {
  const position = (x: number, y: number): Position =>
    altitude === undefined ? [x, y] : [x, y, altitude];
  const ring = (x: number, y: number, size: number): Position[] => {
    const first = position(x, y);
    return [
      first,
      position(x + size, y),
      position(x + size, y + size),
      position(x, y + size),
      first,
    ];
  };
  const outer = ring(10, 58, 1);
  const hole = ring(10.2, 58.2, 0.2).reverse();
  const geometry: Fixture['geometry'] =
    type === 'Polygon'
      ? { type, coordinates: [outer, hole] }
      : type === 'MultiPolygon'
        ? { type, coordinates: [[outer, hole], [ring(12, 58, 1)]] }
        : { type, coordinates: outer };
  return { type: 'Feature', properties: { name: 'Shared coordinates' }, geometry };
};

const copyValues = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const firstPosition = (feature: Fixture): Position =>
  feature.geometry.type === 'LineString'
    ? feature.geometry.coordinates[0]
    : feature.geometry.type === 'Polygon'
      ? feature.geometry.coordinates[0][0]
      : feature.geometry.coordinates[0][0][0];

describe.each(['Polygon', 'MultiPolygon', 'LineString'] as const)(
  '%s with shared coordinate arrays',
  (type) => {
    describe.each([undefined, 123])('altitude %s', (altitude) => {
      it('translates shared positions once per call and keeps the in-place API', () => {
        const feature = makeFixture(type, altitude);
        const expected = copyValues(feature);
        const originalPosition = firstPosition(feature);
        for (const offset of [
          { lng: 1, lat: 1 },
          { lng: -2, lat: 0.5 },
          { lng: 0.25, lat: -0.75 },
        ]) {
          const before = [...originalPosition];
          expect(moveGeoJson(feature as GeoJsonShapeFeature, offset)).toBe(feature);
          moveGeoJson(expected as GeoJsonShapeFeature, offset);
          expect(feature).toEqual(expected);
          expect(firstPosition(feature)).toBe(originalPosition);
          expect(originalPosition[0]).toBe(before[0] + offset.lng);
          expect(originalPosition[1]).toBe(before[1] + offset.lat);
          expect(originalPosition.slice(2)).toEqual(before.slice(2));
        }
      });

      it('reconstructs geodesic drags without transforming a shared closing vertex twice', () => {
        const feature = makeFixture(type, altitude);
        const original = copyValues(feature);
        const anchor: LngLatTuple = [10.5, 58.5];
        for (const target of [[10.6, 58.7], [9.8, 57.9], anchor] as LngLatTuple[]) {
          const expected = getTranslatedGeoJson(
            copyValues(feature) as GeoJsonShapeFeature,
            anchor,
            target,
          );
          const moved = getTranslatedGeoJson(feature as GeoJsonShapeFeature, anchor, target);
          expect(moved).toEqual(expected);
          expect(moved).not.toBe(feature);
          expect(feature).toEqual(original);
          expect(firstPosition(moved as Fixture).slice(2)).toEqual(firstPosition(feature).slice(2));
        }
      });

      it('matches JSON-parsed geometry across successive geodesic drags', () => {
        let feature = makeFixture(type, altitude) as GeoJsonShapeFeature;
        let expected = copyValues(feature);
        let anchor: LngLatTuple = [10.5, 58.5];
        for (const target of [
          [10.6, 58.7],
          [9.8, 57.9],
          [10.5, 58.5],
        ] as LngLatTuple[]) {
          feature = getTranslatedGeoJson(feature, anchor, target);
          expected = getTranslatedGeoJson(expected, anchor, target);
          expect(feature).toEqual(expected);
          anchor = target;
        }
      });
    });
  },
);

it('translates a shared non-closing position only once', () => {
  const shared = [10, 58];
  const feature: Feature<LineString> = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: [[9, 57], shared, [11, 59], shared, [12, 60]] },
  };
  moveGeoJson(feature as GeoJsonShapeFeature, { lng: 1, lat: 2 });
  expect(shared).toEqual([11, 60]);
});
