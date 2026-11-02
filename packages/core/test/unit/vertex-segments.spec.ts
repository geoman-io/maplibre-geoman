import { describe, expect, it } from 'vitest';
import type { LineString, Polygon } from 'geojson';
import { segmentsTouchingVertex } from '@/utils/vertex-segments.ts';

const ring = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
  [0, 0],
];

const polygon: Polygon = { type: 'Polygon', coordinates: [ring] };

describe('segmentsTouchingVertex', () => {
  it('returns only the two edges of a polygon vertex, including the closing edge', () => {
    const first = segmentsTouchingVertex(polygon, ['geometry', 'coordinates', 0, 0]);
    expect(first?.map((item) => item.index).sort()).toEqual([0, 3]);

    const second = segmentsTouchingVertex(polygon, ['geometry', 'coordinates', 0, 1]);
    expect(second?.map((item) => item.index).sort()).toEqual([0, 1]);
    expect(second?.[0].segment.start.coordinate).toEqual([1, 0]);
  });

  it('does not walk unrelated vertices of a long ring', () => {
    const coordinates = Array.from({ length: 5000 }, (_, index) => [index / 1000, 0]);
    coordinates.push([0, 1], coordinates[0]);
    const large: Polygon = { type: 'Polygon', coordinates: [coordinates] };
    const touching = segmentsTouchingVertex(large, ['geometry', 'coordinates', 0, 10]);
    expect(touching).toHaveLength(2);
    expect(touching?.every((item) => item.index === 9 || item.index === 10)).toBe(true);
  });

  it('returns one edge for a line endpoint', () => {
    const line: LineString = {
      type: 'LineString',
      coordinates: [
        [0, 0],
        [1, 0],
        [2, 1],
      ],
    };
    expect(segmentsTouchingVertex(line, ['geometry', 'coordinates', 0])).toHaveLength(1);
    expect(segmentsTouchingVertex(line, ['geometry', 'coordinates', 1])).toHaveLength(2);
  });
});
