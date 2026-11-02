import type {
  Geometry,
  LineString,
  MultiLineString,
  MultiPolygon,
  Polygon,
  Position,
} from 'geojson';
import type { SegmentPosition } from '@/types/geojson.ts';
import type { LngLatTuple } from '@/types/map/index.ts';

export type TouchingSegment = {
  /** Index matching `eachSegmentWithPath` / `edge.${index}` marker keys. */
  index: number;
  segment: SegmentPosition;
};

const segmentCount = (ring: Array<Position>): number => Math.max(ring.length - 1, 0);

const offsetBefore = (
  geometry: LineString | MultiLineString | Polygon | MultiPolygon,
  ringIndexes: Array<number>,
): number => {
  if (geometry.type === 'LineString') return 0;
  if (geometry.type === 'MultiLineString') {
    const lineIndex = ringIndexes[0] ?? 0;
    let sum = 0;
    for (let index = 0; index < lineIndex; index += 1) {
      sum += segmentCount(geometry.coordinates[index] ?? []);
    }
    return sum;
  }
  if (geometry.type === 'Polygon') {
    const ringIndex = ringIndexes[0] ?? 0;
    let sum = 0;
    for (let index = 0; index < ringIndex; index += 1) {
      sum += segmentCount(geometry.coordinates[index] ?? []);
    }
    return sum;
  }
  const [polygonIndex = 0, ringIndex = 0] = ringIndexes;
  let sum = 0;
  for (let index = 0; index < polygonIndex; index += 1) {
    for (const ring of geometry.coordinates[index] ?? []) sum += segmentCount(ring);
  }
  for (let index = 0; index < ringIndex; index += 1) {
    sum += segmentCount(geometry.coordinates[polygonIndex]?.[index] ?? []);
  }
  return sum;
};

const ringAt = (
  geometry: LineString | MultiLineString | Polygon | MultiPolygon,
  indexes: Array<number>,
): Array<Position> | null => {
  let current: unknown = geometry.coordinates;
  for (const index of indexes) {
    if (!Array.isArray(current)) return null;
    current = current[index];
  }
  if (!Array.isArray(current) || current.length < 2 || !Array.isArray(current[0])) return null;
  if (typeof current[0][0] !== 'number') return null;
  return current as Array<Position>;
};

/**
 * The one or two segments that share a vertex, without walking the rest of the
 * geometry. `path` is a marker coordinate path (`geometry.coordinates...`).
 * Returns null when the path does not address a line or polygon vertex (#265).
 */
export const segmentsTouchingVertex = (
  geometry: Geometry,
  path: Array<string | number>,
): Array<TouchingSegment> | null => {
  if (
    geometry.type !== 'LineString' &&
    geometry.type !== 'MultiLineString' &&
    geometry.type !== 'Polygon' &&
    geometry.type !== 'MultiPolygon'
  ) {
    return null;
  }

  const local = path[0] === 'geometry' ? path.slice(1) : path;
  if (local[0] !== 'coordinates') return null;
  const indexes = local.slice(1);
  if (indexes.length === 0 || indexes.some((part) => typeof part !== 'number')) return null;

  const vertexIndex = indexes[indexes.length - 1] as number;
  const ringIndexes = indexes.slice(0, -1) as Array<number>;
  const ring = ringAt(geometry, ringIndexes);
  if (!ring) return null;

  const closed = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
  const segmentTotal = segmentCount(ring);
  const localVertex = closed && vertexIndex === ring.length - 1 ? 0 : vertexIndex;
  if (closed) {
    if (localVertex < 0 || localVertex >= segmentTotal) return null;
  } else if (localVertex < 0 || localVertex >= ring.length) {
    return null;
  }

  const localIndexes: Array<number> = [];
  if (closed) {
    localIndexes.push(localVertex, localVertex === 0 ? segmentTotal - 1 : localVertex - 1);
  } else {
    if (localVertex > 0) localIndexes.push(localVertex - 1);
    if (localVertex < ring.length - 1) localIndexes.push(localVertex);
  }

  const ringPath = path.slice(0, -1);
  const offset = offsetBefore(geometry, ringIndexes);
  const seen = new Set<number>();
  const segments: Array<TouchingSegment> = [];
  for (const localIndex of localIndexes) {
    if (seen.has(localIndex) || localIndex < 0 || localIndex >= segmentTotal) continue;
    seen.add(localIndex);
    segments.push({
      index: offset + localIndex,
      segment: {
        start: {
          coordinate: [ring[localIndex][0], ring[localIndex][1]] as LngLatTuple,
          path: [...ringPath, localIndex],
        },
        end: {
          coordinate: [ring[localIndex + 1][0], ring[localIndex + 1][1]] as LngLatTuple,
          path: [...ringPath, localIndex + 1],
        },
      },
    });
  }
  return segments;
};

/** A single-vertex drag of a line or polygon keeps the ring structure. */
export const vertexDragKeepsMarkerSources = (
  markerType: string | undefined,
  shape: string | undefined,
): boolean => markerType === 'vertex' && (shape === 'line' || shape === 'polygon');
