import { describe, expect, it, vi } from 'vitest';
import log from 'loglevel';
import {
  bBoxContains,
  boundsContains,
  eachCoordinateWithPath,
  eachSegmentWithPath,
  findCoordinateWithPath,
  getBboxFromTwoCoords,
  getCoordinateByPath,
  getEuclideanSegmentNearestPoint,
  removeVertexFromLine,
  removeVertexFromMultiPolygon,
  removeVertexFromPolygon,
  twoCoordsToGeoJsonRectangle,
} from '@/utils/geojson.ts';

describe('utils/geojson', () => {
  it('builds bbox and rectangle polygon from two corners', () => {
    expect(getBboxFromTwoCoords([4, 10], [1, 20])).toEqual([1, 10, 4, 20]);

    expect(twoCoordsToGeoJsonRectangle([4, 10], [1, 20]).geometry.coordinates[0]).toEqual([
      [1, 10],
      [4, 10],
      [4, 20],
      [1, 20],
      [1, 10],
    ]);
  });

  it('checks containment for bbox and bounds helpers', () => {
    const bbox: [number, number, number, number] = [0, 0, 10, 10];
    const bounds: [[number, number], [number, number]] = [
      [0, 0],
      [10, 10],
    ];

    expect(bBoxContains(bbox, [5, 5])).toBe(true);
    expect(bBoxContains(bbox, [11, 5])).toBe(false);
    expect(boundsContains(bounds, [10, 10])).toBe(true);
    expect(boundsContains(bounds, [-1, 0])).toBe(false);
  });

  it('iterates coordinates and can skip polygon closing coordinate', () => {
    const polygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
        ],
      },
    } as const;

    const all: Array<unknown> = [];
    eachCoordinateWithPath(polygon, ({ coordinate }) => all.push(coordinate));

    const skipped: Array<unknown> = [];
    eachCoordinateWithPath(
      polygon,
      ({ coordinate }) => skipped.push(coordinate),
      true,
    );

    expect(all).toHaveLength(4);
    expect(skipped).toHaveLength(3);
  });

  it('finds coordinates with path/index and returns null when missing', () => {
    const line = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 0],
          [1, 1],
        ],
      },
    } as const;

    expect(findCoordinateWithPath(line, [1, 0])).toEqual({
      index: 1,
      coordinate: [1, 0],
      path: ['geometry', 'coordinates', 1],
    });
    expect(findCoordinateWithPath(line, [9, 9])).toBeNull();
  });

  it('iterates line segments with start/end paths', () => {
    const line = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 0],
          [1, 1],
        ],
      },
    } as const;

    const segments: Array<{ start: unknown; end: unknown }> = [];
    eachSegmentWithPath(line, (segment) => segments.push(segment));

    expect(segments).toHaveLength(2);
    expect(segments[0].start).toMatchObject({ coordinate: [0, 0], path: ['geometry', 'coordinates', 0] });
    expect(segments[0].end).toMatchObject({ coordinate: [1, 0], path: ['geometry', 'coordinates', 1] });
  });

  it('removes target vertices from line, polygon and multipolygon shapes', () => {
    const line = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
      },
    } as const;
    expect(removeVertexFromLine(line as never, [1, 0])).toBe(true);
    expect(line.geometry.coordinates).toEqual([
      [0, 0],
      [2, 0],
    ]);

    const polygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [2, 0],
            [2, 2],
            [0, 2],
            [0, 0],
          ],
        ],
      },
    } as const;
    expect(removeVertexFromPolygon(polygon as never, [0, 0])).toBe(true);
    expect(polygon.geometry.coordinates[0][0]).toEqual([2, 0]);
    expect(polygon.geometry.coordinates[0].at(-1)).toEqual([2, 0]);

    const multiPolygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 0],
            ],
          ],
        ],
      },
    } as const;
    expect(removeVertexFromMultiPolygon(multiPolygon as never, [0, 0])).toBe(true);
    expect(multiPolygon.geometry.coordinates).toEqual([]);
  });

  it('returns nearest euclidean point on segment with clamping', () => {
    expect(getEuclideanSegmentNearestPoint([0, 0], [10, 0], [5, 5])).toEqual([5, 0]);
    expect(getEuclideanSegmentNearestPoint([0, 0], [10, 0], [20, 5])).toEqual([10, 0]);
    expect(getEuclideanSegmentNearestPoint([0, 0], [10, 0], [-2, 3])).toEqual([0, 0]);
  });

  it('returns coordinate by path and warns for invalid paths', () => {
    const warnSpy = vi.spyOn(log, 'warn').mockImplementation(() => undefined);
    const line = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 0],
        ],
      },
    } as const;

    expect(getCoordinateByPath(line, ['geometry', 'coordinates', 1])).toEqual([1, 0]);
    expect(getCoordinateByPath(line, ['geometry', 'coordinates', 999])).toBeNull();
    expect(warnSpy).toHaveBeenCalledOnce();
  });
});
