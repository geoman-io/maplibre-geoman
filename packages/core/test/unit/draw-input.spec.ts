import { describe, expect, it, vi } from 'vitest';
vi.mock('@/core/map/base/index.ts', () => ({ BaseMapAdapter: class {} }));
vi.mock('@tests/types.ts', () => ({
  isLineBasedGeoJsonFeature: () => false,
  isPointBasedGeoJsonFeature: () => false,
}));
import { buildDrawFeature, isCompleteDrawFeature } from '@/utils/draw-input.ts';
import type { DrawInput } from '@/types/draw-api.ts';
import distance from '@turf/distance';
import { getRectanglePropertiesFromDiagonal } from '@/utils/shapes.ts';
import { FEATURE_PROPERTY_PREFIX as P } from '@/core/features/constants.ts';

const circle: DrawInput = { shape: 'circle', center: [10, 70], radiusMeters: 500 };
const rectangle: DrawInput = {
  shape: 'rectangle',
  center: [10, 70],
  widthMeters: 100,
  heightMeters: 100,
};

describe('draw input geometry', () => {
  it('constructs a point at zero longitude and latitude', () => {
    expect(buildDrawFeature({ shape: 'marker', coordinates: [0, 0] })).toMatchObject({
      properties: { [`${P}shape`]: 'marker' },
      geometry: { type: 'Point', coordinates: [0, 0] },
    });
  });
  it('constructs a geodesic circle with the exact supplied center and radius', () => {
    const feature = buildDrawFeature(circle)!;
    expect(feature.properties[`${P}center`]).toEqual([10, 70]);
    expect(feature.geometry.type).toBe('Polygon');
    if (feature.geometry.type !== 'Polygon') throw new Error('Expected polygon');
    expect(feature.geometry.coordinates[0]).toHaveLength(81);
    for (const vertex of feature.geometry.coordinates[0]) {
      expect(distance([10, 70], vertex, { units: 'meters' })).toBeCloseTo(500, 6);
    }
  });
  it.each([0, 45, -30, 720])(
    'preserves square dimensions at high latitude, angle %s',
    (angleDegrees) => {
      const feature = buildDrawFeature({ ...rectangle, angleDegrees })!;
      if (feature.geometry.type !== 'Polygon') throw new Error('Expected polygon');
      const ring = feature.geometry.coordinates[0];
      const angle = ((angleDegrees % 360) + 360) % 360;
      const recovered = getRectanglePropertiesFromDiagonal({
        draggedCorner: ring[0] as [number, number],
        oppositeCorner: ring[2] as [number, number],
        angle,
      });
      expect(recovered.width).toBeCloseTo(100, 5);
      expect(recovered.height).toBeCloseTo(100, 5);
      expect(recovered.center[1]).toBeCloseTo(70, 8);
      expect(feature.properties[`${P}angle`]).toBe(angle);
      expect(ring[0]).toEqual(ring[4]);
      expect(ring[0]).not.toBe(ring[4]);
    },
  );
  it('copies custom properties and coordinates without retaining caller references', () => {
    const input: DrawInput = {
      shape: 'marker',
      coordinates: [1, 2],
      properties: { nested: { x: 1 } },
    };
    const feature = buildDrawFeature(input)!;
    input.coordinates[0] = 9;
    (input.properties!.nested as { x: number }).x = 9;
    expect(feature.geometry).toEqual({ type: 'Point', coordinates: [1, 2] });
    expect(feature.properties.nested).toEqual({ x: 1 });
  });
  it.each([
    null,
    {},
    { shape: 'triangle' },
    { shape: 'marker', coordinates: [NaN, 0] },
    { shape: 'marker', coordinates: [0, Infinity] },
    { shape: 'marker', coordinates: [181, 0] },
    { shape: 'marker', coordinates: [0, 90] },
    { shape: 'marker', coordinates: [0] },
    { shape: 'marker', coordinates: ['0', 0] },
    { ...circle, radiusMeters: 0 },
    { ...circle, radiusMeters: -1 },
    { ...circle, radiusMeters: Infinity },
    { ...circle, radiusMeters: 20000000 },
    { ...circle, center: [179.9999, 0], radiusMeters: 1000 },
    { ...rectangle, widthMeters: 0 },
    { ...rectangle, heightMeters: -1 },
    { ...rectangle, angleDegrees: NaN },
    { ...rectangle, center: [0, 90] },
    { ...circle, properties: [] },
    { ...circle, properties: null },
    { ...circle, properties: { [`${P}shape`]: 'marker' } },
    { ...circle, properties: { shape: 'marker' } },
    { ...circle, properties: { gm_id: 'injected' } },
  ])('rejects malformed or unsupported input %#', (input) => {
    expect(buildDrawFeature(input as DrawInput)).toBeNull();
  });
  it('rejects degenerate / unclosed previews', () => {
    const feature = buildDrawFeature(rectangle)!;
    if (feature.geometry.type !== 'Polygon') throw new Error('Expected polygon');
    feature.geometry.coordinates = [
      [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],
    ];
    expect(isCompleteDrawFeature(feature)).toBe(false);
    feature.geometry.coordinates = [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
    ];
    expect(isCompleteDrawFeature(feature)).toBe(false);
  });
});
