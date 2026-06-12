import { describe, expect, it, vi } from 'vitest';

// '@/utils/features.ts' value-imports BaseMapAdapter, which pulls in the Svelte
// controls; mock it (and the '@tests' guards) to keep this spec node-only
vi.mock('@/core/map/base/index.ts', () => ({
  BaseMapAdapter: class {},
}));
vi.mock('@tests/types.ts', () => ({
  isLineBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['LineString', 'MultiLineString'].includes(geoJson?.geometry?.type ?? ''),
  isPointBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['Point', 'MultiPoint'].includes(geoJson?.geometry?.type ?? ''),
}));

import {
  getRectangleCornerCoordinates,
  getRectanglePropertiesFromDiagonal,
  rebuildRectangle,
} from '@/utils/shapes.ts';
import type { LngLatTuple } from '@/types/map/index.ts';

const roundTrip = (center: LngLatTuple, width: number, height: number, angle: number) => {
  const corners = getRectangleCornerCoordinates({ center, width, height, angle });
  return getRectanglePropertiesFromDiagonal({
    draggedCorner: corners[0],
    oppositeCorner: corners[2],
    angle,
  });
};

describe('utils/shapes rectangle math', () => {
  it('recovers center, width and height from a diagonal (axis-aligned)', () => {
    const recovered = roundTrip([10, 20], 1000, 500, 0);

    expect(recovered.center[0]).toBeCloseTo(10, 6);
    expect(recovered.center[1]).toBeCloseTo(20, 6);
    expect(recovered.width).toBeCloseTo(1000, 0);
    expect(recovered.height).toBeCloseTo(500, 0);
  });

  it('recovers center, width and height from a diagonal (rotated, high latitude)', () => {
    const recovered = roundTrip([10, 60], 1000, 500, 37);

    expect(recovered.center[0]).toBeCloseTo(10, 6);
    expect(recovered.center[1]).toBeCloseTo(60, 6);
    expect(recovered.width).toBeCloseTo(1000, 0);
    expect(recovered.height).toBeCloseTo(500, 0);
  });

  it('returns zero dimensions without NaN for a degenerate diagonal', () => {
    const corner: LngLatTuple = [5, 5];
    const recovered = getRectanglePropertiesFromDiagonal({
      draggedCorner: corner,
      oppositeCorner: corner,
      angle: 45,
    });

    expect(recovered.width).toBe(0);
    expect(recovered.height).toBe(0);
    expect(recovered.center[0]).toBeCloseTo(5, 6);
    expect(recovered.center[1]).toBeCloseTo(5, 6);
  });

  it('normalizes the angle and produces a closed ring in rebuildRectangle', () => {
    const geoJson = {
      type: 'Feature',
      properties: {
        __gm_shape: 'rectangle',
        __gm_center: [10, 20],
        __gm_width: 1000,
        __gm_height: 500,
        __gm_angle: 0,
      },
      geometry: { type: 'Polygon', coordinates: [[]] },
    } as never;

    const rebuilt = rebuildRectangle({ geoJson, center: [10, 20], angle: 450 });

    expect(rebuilt.properties?.__gm_angle).toBe(90);
    const ring = (rebuilt.geometry as { coordinates: number[][][] }).coordinates[0];
    expect(ring).toHaveLength(5);
    expect(ring[0]).toEqual(ring[4]);
  });

  it('returns the input unchanged when rectangle properties are missing', () => {
    const geoJson = {
      type: 'Feature',
      properties: { __gm_shape: 'rectangle' },
      geometry: { type: 'Polygon', coordinates: [[]] },
    } as never;

    expect(rebuildRectangle({ geoJson, center: [0, 0], angle: 10 })).toBe(geoJson);
  });
});
