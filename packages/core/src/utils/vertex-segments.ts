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

/**
 * Above this many positions, a vertex drag must not clone or re-upload the whole
 * feature on every pointer move (#282).
 */
export const LARGE_VERTEX_DRAG_COORDINATES = 512;

const replaceNested = (root: unknown, path: Array<string | number>, value: unknown): unknown => {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root) && typeof head === 'number') {
    const next = root.slice();
    next[head] = replaceNested(root[head], rest, value);
    return next;
  }
  if (root && typeof root === 'object' && (typeof head === 'string' || typeof head === 'number')) {
    const record = root as Record<string, unknown>;
    return { ...record, [head]: replaceNested(record[head], rest, value) };
  }
  return root;
};

/**
 * A new feature with one vertex moved. Only the arrays on the path to that
 * vertex are copied; every other ring is shared. The closing coordinate of a
 * polygon ring moves with vertex 0.
 */
export const withMovedVertex = <T extends { geometry: Geometry }>(
  feature: T,
  path: Array<string | number>,
  lngLat: LngLatTuple,
  shape: string,
): T => {
  const coordPath = [...path];
  const coordIndex = coordPath.pop();
  if (typeof coordIndex !== 'number') return feature;
  const ring = coordPath.reduce<unknown>((current, key) => {
    if (current == null || typeof current !== 'object') return undefined;
    return (current as Record<string | number, unknown>)[key];
  }, feature);
  if (!Array.isArray(ring)) return feature;

  const next = [lngLat[0], lngLat[1]] as LngLatTuple;
  const nextRing = ring.slice();
  nextRing[coordIndex] = next;
  if (coordIndex === 0 && shape === 'polygon' && nextRing.length > 1) {
    nextRing[nextRing.length - 1] = [next[0], next[1]];
  }
  return replaceNested(feature, coordPath, nextRing) as T;
};

const vertexIndexFromPath = (path: Array<string | number>): number | null => {
  const local = path[0] === 'geometry' ? path.slice(1) : path;
  if (local[0] !== 'coordinates' || local.length < 2) return null;
  const vertexIndex = local[local.length - 1];
  return typeof vertexIndex === 'number' ? vertexIndex : null;
};

/**
 * Ring with the dragged vertex removed, so the stale corner is not rendered
 * while a rubber-band line shows the pointer. Null when the ring would become
 * too short to stay a line or polygon.
 */
export const geometryHidingVertex = (
  geometry: Geometry,
  path: Array<string | number>,
): Geometry | null => {
  if (
    geometry.type !== 'LineString' &&
    geometry.type !== 'MultiLineString' &&
    geometry.type !== 'Polygon' &&
    geometry.type !== 'MultiPolygon'
  ) {
    return null;
  }
  const vertexIndex = vertexIndexFromPath(path);
  if (vertexIndex == null) return null;
  const local = path[0] === 'geometry' ? path.slice(1) : path;
  const ringIndexes = local.slice(1, -1) as Array<number>;
  const ring = ringAt(geometry, ringIndexes);
  if (!ring) return null;

  const closed = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
  const localVertex = closed && vertexIndex === ring.length - 1 ? 0 : vertexIndex;
  const unique = closed ? ring.slice(0, -1) : ring.slice();
  if (localVertex < 0 || localVertex >= unique.length) return null;
  if (closed && unique.length <= 3) return null;
  if (!closed && unique.length <= 2) return null;

  unique.splice(localVertex, 1);
  const nextRing = closed ? [...unique, [unique[0][0], unique[0][1]]] : unique;
  const coordPath = path.slice(0, -1);
  const replaced = replaceNested({ geometry }, coordPath, nextRing) as { geometry: Geometry };
  return replaced.geometry;
};

/** The two edges from the dragged vertex's neighbors to the pointer. */
export const rubberBandCoordinates = (
  geometry: Geometry,
  path: Array<string | number>,
  lngLat: LngLatTuple,
): Array<LngLatTuple> | null => {
  if (
    geometry.type !== 'LineString' &&
    geometry.type !== 'MultiLineString' &&
    geometry.type !== 'Polygon' &&
    geometry.type !== 'MultiPolygon'
  ) {
    return null;
  }
  const vertexIndex = vertexIndexFromPath(path);
  if (vertexIndex == null) return null;
  const local = path[0] === 'geometry' ? path.slice(1) : path;
  const ring = ringAt(geometry, local.slice(1, -1) as Array<number>);
  if (!ring) return null;

  const closed = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
  const localVertex = closed && vertexIndex === ring.length - 1 ? 0 : vertexIndex;
  const lastUnique = closed ? ring.length - 2 : ring.length - 1;
  if (localVertex < 0 || localVertex > lastUnique) return null;

  const prevIndex = localVertex === 0 ? (closed ? lastUnique : -1) : localVertex - 1;
  const nextIndex = localVertex === lastUnique ? (closed ? 0 : -1) : localVertex + 1;
  const coordinates: Array<LngLatTuple> = [];
  if (prevIndex >= 0) coordinates.push([ring[prevIndex][0], ring[prevIndex][1]]);
  coordinates.push([lngLat[0], lngLat[1]]);
  if (nextIndex >= 0) coordinates.push([ring[nextIndex][0], ring[nextIndex][1]]);
  return coordinates.length >= 2 ? coordinates : null;
};
