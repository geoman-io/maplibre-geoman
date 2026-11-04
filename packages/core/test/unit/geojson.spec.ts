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
  multiLineStringToFeatureCollection,
  removeVertexFromLine,
  removeVertexFromMultiPolygon,
  removeVertexFromPolygon,
  convertToLineStringFeatureCollection,
  featuresIntersect,
  polygonDifference,
  polygonUnion,
  polygonsIntersect,
  toLineStringFeature,
  twoCoordsToGeoJsonRectangle,
} from '@/utils/geojson.ts';
import {
  calculateEuclideanRotationAngle,
  getEuclideanSegmentNearestPoint,
} from '@/utils/planar.ts';

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
    eachCoordinateWithPath(polygon, ({ coordinate }) => skipped.push(coordinate), true);

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
    expect(segments[0].start).toMatchObject({
      coordinate: [0, 0],
      path: ['geometry', 'coordinates', 0],
    });
    expect(segments[0].end).toMatchObject({
      coordinate: [1, 0],
      path: ['geometry', 'coordinates', 1],
    });
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
    const holedTriangle = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [0, 0],
            [3, 0],
            [0, 3],
            [0, 0],
          ],
          [
            [0.2, 0.2],
            [0.4, 0.2],
            [0.2, 0.4],
            [0.2, 0.2],
          ],
        ],
      },
    };
    expect(removeVertexFromPolygon(holedTriangle as never, [3, 0])).toBe(false);
    expect(holedTriangle.geometry.coordinates).toHaveLength(2);
    expect(removeVertexFromPolygon(holedTriangle as never, [0.4, 0.2])).toBe(true);
    expect(holedTriangle.geometry.coordinates).toHaveLength(1);

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

  it('returns the segment point for a zero-length segment instead of NaN', () => {
    expect(getEuclideanSegmentNearestPoint([5, 5], [5, 5], [1, 1])).toEqual([5, 5]);
  });

  it('calculates euclidean rotation angles including the ±180° wrap', () => {
    // quarter turn from the positive x-axis to the positive y-axis
    expect(calculateEuclideanRotationAngle([0, 0], [1, 0], [0, 1])).toBeCloseTo(-90, 6);

    // crossing the ±180° boundary: 170° -> -170° is a 20° step, not 340°
    const startPoint: [number, number] = [
      Math.cos((170 * Math.PI) / 180),
      Math.sin((170 * Math.PI) / 180),
    ];
    const endPoint: [number, number] = [
      Math.cos((-170 * Math.PI) / 180),
      Math.sin((-170 * Math.PI) / 180),
    ];
    expect(calculateEuclideanRotationAngle([0, 0], startPoint, endPoint)).toBeCloseTo(-20, 6);
  });

  it('gives each feature from a MultiLineString its own properties object', () => {
    const multiLine = {
      type: 'Feature',
      properties: { name: 'source' },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [0, 0],
            [1, 1],
          ],
          [
            [2, 2],
            [3, 3],
          ],
        ],
      },
    } as const;

    const collection = multiLineStringToFeatureCollection(multiLine as never);
    expect(collection.features).toHaveLength(2);

    collection.features[0].properties!.name = 'mutated';
    expect(collection.features[1].properties!.name).toBe('source');
    expect(multiLine.properties.name).toBe('source');
  });

  it('removes the targeted vertex when ring coordinates carry altitude values', () => {
    const polygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0, 5],
            [2, 0, 5],
            [2, 2, 5],
            [0, 2, 5],
            [0, 0, 5],
          ],
        ],
      },
    } as const;

    expect(removeVertexFromPolygon(polygon as never, [2, 0])).toBe(true);
    expect(polygon.geometry.coordinates[0]).toEqual([
      [0, 0, 5],
      [2, 2, 5],
      [0, 2, 5],
      [0, 0, 5],
    ]);

    const multiPolygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [0, 0, 5],
              [2, 0, 5],
              [2, 2, 5],
              [0, 2, 5],
              [0, 0, 5],
            ],
          ],
        ],
      },
    } as const;

    expect(removeVertexFromMultiPolygon(multiPolygon as never, [2, 0])).toBe(true);
    expect(multiPolygon.geometry.coordinates[0][0]).toEqual([
      [0, 0, 5],
      [2, 2, 5],
      [0, 2, 5],
      [0, 0, 5],
    ]);
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

  it('does not throw when tracing a polygon that has no coordinates', () => {
    const collection = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: { type: 'Polygon' as const, coordinates: [] },
        },
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Polygon' as const,
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 0],
              ],
            ],
          },
        },
      ],
    };

    expect(() => convertToLineStringFeatureCollection(collection as never)).not.toThrow();
    expect(convertToLineStringFeatureCollection(collection as never).features).toHaveLength(1);

    const mixedMulti = {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'MultiPolygon' as const,
            coordinates: [
              [
                [
                  [0, 0],
                  [1, 0],
                  [1, 1],
                  [0, 0],
                ],
              ],
              [[[0, 0]]],
            ],
          },
        },
      ],
    };
    expect(() => convertToLineStringFeatureCollection(mixedMulti as never)).not.toThrow();
    expect(
      convertToLineStringFeatureCollection(mixedMulti as never).features.length,
    ).toBeGreaterThan(0);
  });

  it('does not throw when a line part has fewer than two positions', () => {
    expect(toLineStringFeature([])).toBeNull();
    expect(toLineStringFeature([[0, 0]])).toBeNull();
    expect(
      toLineStringFeature([
        [0, 0],
        [1, 1],
      ])?.geometry.coordinates,
    ).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it('does not throw when a polygon ring is empty', () => {
    const emptyRing = {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'Polygon' as const, coordinates: [[]] },
    };
    const square = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ],
      },
    };

    expect(() =>
      convertToLineStringFeatureCollection({ type: 'FeatureCollection', features: [emptyRing] }),
    ).not.toThrow();
    expect(featuresIntersect(emptyRing, square)).toBe(false);
    expect(featuresIntersect(square, square)).toBe(true);
  });

  it('unions and cuts a polygon that has an empty hole', () => {
    const withHole = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [0, 0],
            [8, 0],
            [8, 8],
            [0, 8],
            [0, 0],
          ],
          [],
        ],
      },
    };
    const overlap = {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [6, 6],
            [12, 6],
            [12, 12],
            [6, 12],
            [6, 6],
          ],
        ],
      },
    };

    expect(polygonsIntersect(withHole, overlap)).toBe(true);
    expect(polygonUnion([withHole, overlap])?.geometry.type).toBe('Polygon');
    expect(polygonDifference(withHole, overlap)?.geometry.type).toBe('Polygon');
  });
});
