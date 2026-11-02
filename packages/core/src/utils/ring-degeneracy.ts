import type { MultiPolygon, Polygon, Position } from 'geojson';

/**
 * Exact 2D orientation of `c` relative to the directed line `a -> b`.
 * `0` means the three positions are collinear in exact arithmetic, so a thin
 * valid triangle is not rejected by a tolerance (#266).
 */
export const orientation = (
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): -1 | 0 | 1 => {
  const detleft = (ay - cy) * (bx - cx);
  const detright = (ax - cx) * (by - cy);
  const det = detleft - detright;
  const detsum = Math.abs(detleft) + Math.abs(detright);
  // Shewchuk's non-adaptive filter. Below it, the float sign is not trustworthy.
  const errbound = (3 + 16 * Number.EPSILON) * Number.EPSILON * detsum;
  if (det > errbound) return 1;
  if (-det > errbound) return -1;
  return exactOrientation(ax, ay, bx, by, cx, cy);
};

type Rational = { n: bigint; e: number };

const normalize = (n: bigint, e: number): Rational => {
  if (n === 0n) return { n: 0n, e: 0 };
  let value = n;
  let exp = e;
  while ((value & 1n) === 0n) {
    value >>= 1n;
    exp += 1;
  }
  return { n: value, e: exp };
};

/** Float64 as `n * 2^e`, so differences and products below stay exact. */
const floatToRational = (value: number): Rational => {
  if (!Number.isFinite(value) || value === 0) return { n: 0n, e: 0 };
  const bits = new DataView(new ArrayBuffer(8));
  bits.setFloat64(0, value);
  const raw = bits.getBigUint64(0);
  const sign = raw >> 63n === 0n ? 1n : -1n;
  const exponent = Number((raw >> 52n) & 0x7ffn);
  const fraction = raw & 0xfffffffffffffn;
  if (exponent === 0) return normalize(sign * fraction, -1074);
  return normalize(sign * (fraction | (1n << 52n)), exponent - 1075);
};

const sub = (a: Rational, b: Rational): Rational => {
  const exp = Math.min(a.e, b.e);
  return normalize((a.n << BigInt(a.e - exp)) - (b.n << BigInt(b.e - exp)), exp);
};

const mul = (a: Rational, b: Rational): Rational => normalize(a.n * b.n, a.e + b.e);

const exactOrientation = (
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): -1 | 0 | 1 => {
  // Same determinant as the float filter: (a - c) × (b - c).
  const det = sub(
    mul(
      sub(floatToRational(ay), floatToRational(cy)),
      sub(floatToRational(bx), floatToRational(cx)),
    ),
    mul(
      sub(floatToRational(ax), floatToRational(cx)),
      sub(floatToRational(by), floatToRational(cy)),
    ),
  );
  if (det.n > 0n) return 1;
  if (det.n < 0n) return -1;
  return 0;
};

const samePosition = (a: Position, b: Position): boolean => a[0] === b[0] && a[1] === b[1];

/**
 * A ring is degenerate when it has fewer than two distinct positions, or every
 * position is exactly collinear. Spherical area can be a tiny non-zero for an
 * exactly collinear ring (#266).
 */
export const isDegenerateRing = (coordinates: Array<Position>): boolean => {
  let origin: Position | null = null;
  let other: Position | null = null;
  for (const position of coordinates) {
    if (!Number.isFinite(position[0]) || !Number.isFinite(position[1])) return false;
    if (!origin) {
      origin = position;
      continue;
    }
    if (!samePosition(origin, position)) {
      other = position;
      break;
    }
  }
  if (!origin || !other) return true;
  return coordinates.every(
    (position) =>
      orientation(origin[0], origin[1], other[0], other[1], position[0], position[1]) === 0,
  );
};

export const hasDegenerateRing = (geometry: Polygon | MultiPolygon): boolean => {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some((rings) => rings.some((ring) => isDegenerateRing(ring)));
};
