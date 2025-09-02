import type { Geometry } from 'geojson';
import { isEqualWith } from 'lodash-es';

export const compareGeoJsonGeometries = ({
  geometry1,
  geometry2,
  precision,
}: {
  geometry1: Geometry;
  geometry2: Geometry;
  precision: number;
}): boolean => {
  return isEqualWith(geometry1, geometry2, (firstValue, secondValue) => {
    if (typeof firstValue === 'number' && typeof secondValue === 'number') {
      return Math.abs(firstValue - secondValue) < Math.pow(10, -precision);
    }
    return undefined;
  });
};
