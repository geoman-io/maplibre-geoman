import type { LngLatTuple, PositionData, SegmentPosition } from '@/types';
import bearing from '@turf/bearing';

const R = 6378137; // WGS84 Earth radius in meters (EPSG:3857)

function project([lng, lat]: LngLatTuple): [number, number] {
  return [((lng * Math.PI) / 180) * R, Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * R];
}

function unproject([x, y]: [number, number]): LngLatTuple {
  return [
    (x / R) * (180 / Math.PI),
    (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * (180 / Math.PI),
  ];
}

export function getSegmentMiddlePosition(segment: SegmentPosition): PositionData {
  const startM = project(segment.start.coordinate);
  const endM = project(segment.end.coordinate);

  const middlePath = segment.start.path.slice(0, segment.start.path.length - 1).concat([-1]);

  return {
    coordinate: unproject([(startM[0] + endM[0]) / 2, (startM[1] + endM[1]) / 2]),
    path: middlePath,
  };
}

export function calculateRotationAngle(
  pivot: LngLatTuple,
  start: LngLatTuple,
  end: LngLatTuple,
  normalize = true,
) {
  const bearingStart = bearing(pivot, start);
  const bearingEnd = bearing(pivot, end);

  const rotationAngle = bearingEnd - bearingStart;
  return normalize ? (rotationAngle + 360) % 360 : rotationAngle;
}
