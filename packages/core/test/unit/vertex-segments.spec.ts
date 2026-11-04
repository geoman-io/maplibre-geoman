import { describe, expect, it } from 'vitest';
import type { LineString, Polygon } from 'geojson';
import {
  geometryHidingVertex,
  rubberBandCoordinates,
  segmentsTouchingVertex,
  withMovedVertex,
} from '@/utils/vertex-segments.ts';

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

  it('moves one vertex without copying an unrelated ring', () => {
    const hole = [
      [0.2, 0.2],
      [0.4, 0.2],
      [0.4, 0.4],
      [0.2, 0.2],
    ];
    const feature = {
      type: 'Feature' as const,
      properties: { name: 'outline' },
      geometry: { type: 'Polygon' as const, coordinates: [ring, hole] },
    };
    const moved = withMovedVertex(feature, ['geometry', 'coordinates', 0, 1], [2, 0], 'polygon');

    expect(moved).not.toBe(feature);
    expect(moved.geometry.coordinates[0][1]).toEqual([2, 0]);
    expect(moved.geometry.coordinates[0][0]).toEqual([0, 0]);
    expect(moved.geometry.coordinates[1]).toBe(hole);
    expect(feature.geometry.coordinates[0][1]).toEqual([1, 0]);
  });

  it('moves the closing coordinate when the first polygon vertex moves', () => {
    const feature = {
      type: 'Feature' as const,
      properties: {},
      geometry: polygon,
    };
    const moved = withMovedVertex(feature, ['geometry', 'coordinates', 0, 0], [0, 2], 'polygon');
    const movedRing = moved.geometry.coordinates[0];
    expect(movedRing[0]).toEqual([0, 2]);
    expect(movedRing[movedRing.length - 1]).toEqual([0, 2]);
  });

  it('hides a dragged vertex and builds a rubber band from its neighbors', () => {
    const hidden = geometryHidingVertex(polygon, ['geometry', 'coordinates', 0, 1]);
    expect(hidden?.type).toBe('Polygon');
    if (hidden?.type !== 'Polygon') return;
    expect(hidden.coordinates[0]).toEqual([
      [0, 0],
      [1, 1],
      [0, 1],
      [0, 0],
    ]);
    expect(rubberBandCoordinates(polygon, ['geometry', 'coordinates', 0, 1], [2, 0])).toEqual([
      [0, 0],
      [2, 0],
      [1, 1],
    ]);
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
