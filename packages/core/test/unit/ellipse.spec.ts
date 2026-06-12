import { describe, expect, it } from 'vitest';
import { distance } from '@turf/distance';
import destination from '@turf/destination';
import turfEllipse from '@/turf/ellipse.ts';
import { ellipseSteps, getEllipseParameters, getGeoJsonEllipse } from '@/utils/geojson.ts';
import type { LngLatTuple } from '@/types/map/index.ts';

const CENTER: LngLatTuple = [10, 50];

const pointAt = (bearing: number, meters: number): LngLatTuple => {
  const point = destination(CENTER, meters, bearing, { units: 'meters' });
  return point.geometry.coordinates as LngLatTuple;
};

describe('utils/geojson getEllipseParameters', () => {
  it('recovers both semi-axes from perpendicular rim points', () => {
    const xSemiAxisLngLat = pointAt(90, 1000); // due east -> cwAngle 0
    const rimLngLat = pointAt(0, 500); // due north -> on the y-semi-axis

    const parameters = getEllipseParameters({ center: CENTER, xSemiAxisLngLat, rimLngLat });

    expect(parameters.xSemiAxis).toBeCloseTo(1000, 0);
    expect(parameters.ySemiAxis).toBeCloseTo(500, 0);
    expect(parameters.angle).toBeCloseTo(0, 5);
  });

  it('returns ySemiAxis 0 when the rim point is collinear with the x-axis', () => {
    const xSemiAxisLngLat = pointAt(90, 1000);

    const parameters = getEllipseParameters({
      center: CENTER,
      xSemiAxisLngLat,
      rimLngLat: xSemiAxisLngLat,
    });

    expect(parameters.ySemiAxis).toBe(0);
    expect(Number.isNaN(parameters.ySemiAxis)).toBe(false);
  });

  it('floors a zero-length x-semi-axis to one meter', () => {
    const parameters = getEllipseParameters({ center: CENTER, xSemiAxisLngLat: CENTER });
    expect(parameters.xSemiAxis).toBe(1);
  });
});

describe('utils/geojson getGeoJsonEllipse', () => {
  it('returns a degenerate LineString when ySemiAxis is zero', () => {
    const result = getGeoJsonEllipse({ center: CENTER, xSemiAxis: 1000, ySemiAxis: 0, angle: 0 });

    expect(result.geometry.type).toBe('LineString');
    const coordinates = (result.geometry as { coordinates: number[][] }).coordinates;
    expect(coordinates).toHaveLength(ellipseSteps / 2 + 1);
  });

  it('stamps shape properties and produces a closed ring for a real ellipse', () => {
    const result = getGeoJsonEllipse({
      center: CENTER,
      xSemiAxis: 1000,
      ySemiAxis: 500,
      angle: 30,
    });

    expect(result.geometry.type).toBe('Polygon');
    expect(result.properties).toMatchObject({
      __gm_shape: 'ellipse',
      __gm_center: CENTER,
      __gm_xSemiAxis: 1000,
      __gm_ySemiAxis: 500,
      __gm_angle: 30,
    });

    const ring = (result.geometry as { coordinates: number[][][] }).coordinates[0];
    expect(ring[0]).toEqual(ring[ring.length - 1]);
  });
});

describe('turf/ellipse', () => {
  it('produces a closed ring with the requested number of steps', () => {
    const result = turfEllipse(CENTER, 1000, 500, { steps: 80, angle: 0, units: 'meters' });

    const ring = result.geometry.coordinates[0];
    expect(ring).toHaveLength(81);
    expect(ring[0]).toEqual(ring[80]);
  });

  it('approximates a circle when both semi-axes are equal', () => {
    const radius = 1000;
    const result = turfEllipse(CENTER, radius, radius, { steps: 80, angle: 0, units: 'meters' });

    for (const position of result.geometry.coordinates[0]) {
      const rimDistance = distance(CENTER, position as LngLatTuple, { units: 'meters' });
      expect(rimDistance).toBeGreaterThan(radius * 0.98);
      expect(rimDistance).toBeLessThan(radius * 1.02);
    }
  });
});
