import type { ScreenPoint } from '@/types';

export const getEuclideanDistance = (point1: ScreenPoint, point2: ScreenPoint): number => {
  return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
};

export const getEuclideanSegmentNearestPoint = (
  linePoint1: ScreenPoint,
  linePoint2: ScreenPoint,
  targetPoint: ScreenPoint,
): ScreenPoint => {
  const [x1, y1] = [linePoint1[0], linePoint1[1]];
  const [x2, y2] = [linePoint2[0], linePoint2[1]];
  const [px, py] = [targetPoint[0], targetPoint[1]];

  // Calculate vector components
  const vx = x2 - x1;
  const vy = y2 - y1;
  const wx = px - x1;
  const wy = py - y1;

  // Calculate dot product and projection scalar
  const c1 = wx * vx + wy * vy;
  const c2 = vx * vx + vy * vy;
  let b = c1 / c2;

  // Clamp b between 0 and 1 to ensure the nearest point lies on the segment
  b = Math.max(0, Math.min(1, b));

  // Calculate nearest point
  return [x1 + b * vx, y1 + b * vy];
};

export const calculateEuclideanRotationAngle = (
  pivotPoint: ScreenPoint,
  startPoint: ScreenPoint,
  endPoint: ScreenPoint,
) => {
  // 1. Calculate the angle of each vector relative to the x-axis
  const angle1 = Math.atan2(startPoint[1] - pivotPoint[1], startPoint[0] - pivotPoint[0]);
  const angle2 = Math.atan2(endPoint[1] - pivotPoint[1], endPoint[0] - pivotPoint[0]);

  // 2. Calculate the difference
  let angleDiff = angle2 - angle1;

  // 3. Normalize the angle to the [-PI, PI] range
  while (angleDiff <= -Math.PI) {
    angleDiff += 2 * Math.PI;
  }
  while (angleDiff > Math.PI) {
    angleDiff -= 2 * Math.PI;
  }

  return -angleDiff * (180 / Math.PI); // Convert to degrees
};
