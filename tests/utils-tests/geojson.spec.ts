import test, { expect, type Page } from '@playwright/test';
import { waitForGeoman } from '@tests/utils/basic.ts';
import type { Feature, LineString, Polygon, MultiPolygon, Point } from 'geojson';
import type { LngLatTuple, PositionData, SegmentPosition } from '@/types';

test.describe('GeoJSON Utility Functions', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/');
    await waitForGeoman(page);
  });

  test.describe('isEqualPosition', () => {
    test('should return true for identical positions', async () => {
      const result = await page.evaluate(() => {
        const { isEqualPosition } = window.geomanUtils;
        return isEqualPosition([10, 20], [10, 20]);
      });
      expect(result).toBe(true);
    });

    test('should return false for different positions', async () => {
      const result = await page.evaluate(() => {
        const { isEqualPosition } = window.geomanUtils;
        return isEqualPosition([10, 20], [10, 21]);
      });
      expect(result).toBe(false);
    });
  });

  test.describe('isLineStringFeature', () => {
    test('should return true for LineString feature', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { isLineStringFeature } = window.geomanUtils;
        return isLineStringFeature(feature);
      }, lineFeature);
      expect(result).toBe(true);
    });

    test('should return false for Polygon feature', async () => {
      const polygonFeature: Feature<Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
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
      const result = await page.evaluate((feature) => {
        const { isLineStringFeature } = window.geomanUtils;
        return isLineStringFeature(feature);
      }, polygonFeature);
      expect(result).toBe(false);
    });
  });

  test.describe('isPolygonFeature', () => {
    test('should return true for Polygon feature', async () => {
      const polygonFeature: Feature<Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
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
      const result = await page.evaluate((feature) => {
        const { isPolygonFeature } = window.geomanUtils;
        return isPolygonFeature(feature);
      }, polygonFeature);
      expect(result).toBe(true);
    });
  });

  test.describe('isMultiPolygonFeature', () => {
    test('should return true for MultiPolygon feature', async () => {
      const multiPolygonFeature: Feature<MultiPolygon> = {
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
                [0, 1],
                [0, 0],
              ],
            ],
            [
              [
                [2, 2],
                [3, 2],
                [3, 3],
                [2, 3],
                [2, 2],
              ],
            ],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { isMultiPolygonFeature } = window.geomanUtils;
        return isMultiPolygonFeature(feature);
      }, multiPolygonFeature);
      expect(result).toBe(true);
    });
  });

  test.describe('getLngLatDiff', () => {
    test('should calculate correct difference between positions', async () => {
      const result = await page.evaluate(() => {
        const { getLngLatDiff } = window.geomanUtils;
        return getLngLatDiff([10, 20], [15, 25]);
      });
      expect(result.lng).toBe(5);
      expect(result.lat).toBe(5);
    });

    test('should handle negative differences', async () => {
      const result = await page.evaluate(() => {
        const { getLngLatDiff } = window.geomanUtils;
        return getLngLatDiff([15, 25], [10, 20]);
      });
      expect(result.lng).toBe(-5);
      expect(result.lat).toBe(-5);
    });
  });

  test.describe('eachCoordinateWithPath', () => {
    test('should iterate through all coordinates of a LineString', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { eachCoordinateWithPath } = window.geomanUtils;
        const positions: Array<{ coordinate: [number, number]; path: Array<string | number> }> = [];
        eachCoordinateWithPath(feature, (position: PositionData) => {
          positions.push({
            coordinate: position.coordinate as [number, number],
            path: position.path,
          });
        });
        return positions;
      }, lineFeature);

      expect(result.length).toBe(3);
      expect(result[0].coordinate).toEqual([0, 0]);
      expect(result[1].coordinate).toEqual([1, 1]);
      expect(result[2].coordinate).toEqual([2, 2]);
    });

    test('should iterate through all coordinates of a Polygon', async () => {
      const polygonFeature: Feature<Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
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
      const result = await page.evaluate((feature) => {
        const { eachCoordinateWithPath } = window.geomanUtils;
        const positions: Array<{ coordinate: [number, number]; path: Array<string | number> }> = [];
        eachCoordinateWithPath(feature, (position: PositionData) => {
          positions.push({
            coordinate: position.coordinate as [number, number],
            path: position.path,
          });
        });
        return positions;
      }, polygonFeature);

      expect(result.length).toBe(5);
    });

    test('should skip closing coordinate when skipClosingCoordinate is true', async () => {
      const polygonFeature: Feature<Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
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
      const result = await page.evaluate((feature) => {
        const { eachCoordinateWithPath } = window.geomanUtils;
        const positions: Array<{ coordinate: [number, number] }> = [];
        eachCoordinateWithPath(
          feature,
          (position: PositionData) => {
            positions.push({
              coordinate: position.coordinate as [number, number],
            });
          },
          true,
        ); // skipClosingCoordinate = true
        return positions;
      }, polygonFeature);

      expect(result.length).toBe(4);
    });
  });

  test.describe('findCoordinateWithPath', () => {
    test('should find coordinate and return path', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { findCoordinateWithPath } = window.geomanUtils;
        return findCoordinateWithPath(feature, [1, 1]);
      }, lineFeature);

      expect(result).not.toBeNull();
      expect(result?.coordinate).toEqual([1, 1]);
      expect(result?.index).toBe(1);
    });

    test('should return null for non-existent coordinate', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { findCoordinateWithPath } = window.geomanUtils;
        return findCoordinateWithPath(feature, [5, 5]);
      }, lineFeature);

      expect(result).toBeNull();
    });
  });

  test.describe('eachSegmentWithPath', () => {
    test('should iterate through all segments of a LineString', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { eachSegmentWithPath } = window.geomanUtils;
        const segments: Array<{ start: [number, number]; end: [number, number] }> = [];
        eachSegmentWithPath(feature, (segment: SegmentPosition) => {
          segments.push({
            start: segment.start.coordinate as [number, number],
            end: segment.end.coordinate as [number, number],
          });
        });
        return segments;
      }, lineFeature);

      expect(result.length).toBe(2);
      expect(result[0].start).toEqual([0, 0]);
      expect(result[0].end).toEqual([1, 1]);
      expect(result[1].start).toEqual([1, 1]);
      expect(result[1].end).toEqual([2, 2]);
    });
  });

  test.describe('getGeoJsonBounds', () => {
    test('should return correct bounds for a LineString', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [10, 10],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { getGeoJsonBounds } = window.geomanUtils;
        return getGeoJsonBounds(feature);
      }, lineFeature);

      expect(result[0]).toEqual([0, 0]); // SW
      expect(result[1]).toEqual([10, 10]); // NE
    });

    test('should return correct bounds for a Polygon', async () => {
      const polygonFeature: Feature<Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-5, -5],
              [5, -5],
              [5, 5],
              [-5, 5],
              [-5, -5],
            ],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { getGeoJsonBounds } = window.geomanUtils;
        return getGeoJsonBounds(feature);
      }, polygonFeature);

      expect(result[0]).toEqual([-5, -5]); // SW
      expect(result[1]).toEqual([5, 5]); // NE
    });
  });

  test.describe('boundsContains', () => {
    test('should return true for point inside bounds', async () => {
      const result = await page.evaluate(() => {
        const { boundsContains } = window.geomanUtils;
        const bounds: [LngLatTuple, LngLatTuple] = [
          [0, 0],
          [10, 10],
        ];
        return boundsContains(bounds, [5, 5]);
      });
      expect(result).toBe(true);
    });

    test('should return false for point outside bounds', async () => {
      const result = await page.evaluate(() => {
        const { boundsContains } = window.geomanUtils;
        const bounds: [LngLatTuple, LngLatTuple] = [
          [0, 0],
          [10, 10],
        ];
        return boundsContains(bounds, [15, 15]);
      });
      expect(result).toBe(false);
    });

    test('should return true for point on boundary', async () => {
      const result = await page.evaluate(() => {
        const { boundsContains } = window.geomanUtils;
        const bounds: [LngLatTuple, LngLatTuple] = [
          [0, 0],
          [10, 10],
        ];
        return boundsContains(bounds, [0, 0]);
      });
      expect(result).toBe(true);
    });
  });

  test.describe('getGeoJsonFirstPoint', () => {
    test('should return first point of LineString', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [5, 10],
            [15, 20],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { getGeoJsonFirstPoint } = window.geomanUtils;
        return getGeoJsonFirstPoint(feature);
      }, lineFeature);

      expect(result).toEqual([5, 10]);
    });

    test('should return first point of Point', async () => {
      const pointFeature: Feature<Point> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [5, 10],
        },
      };
      const result = await page.evaluate((feature) => {
        const { getGeoJsonFirstPoint } = window.geomanUtils;
        return getGeoJsonFirstPoint(feature);
      }, pointFeature);

      expect(result).toEqual([5, 10]);
    });
  });

  test.describe('getGeoJsonCoordinatesCount', () => {
    test('should count coordinates in LineString', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { getGeoJsonCoordinatesCount } = window.geomanUtils;
        return getGeoJsonCoordinatesCount(feature);
      }, lineFeature);

      expect(result).toBe(3);
    });

    test('should count coordinates in Polygon', async () => {
      const polygonFeature: Feature<Polygon> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
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
      const result = await page.evaluate((feature) => {
        const { getGeoJsonCoordinatesCount } = window.geomanUtils;
        return getGeoJsonCoordinatesCount(feature);
      }, polygonFeature);

      // Note: getGeoJsonCoordinatesCount uses excludeWrapCoord=true, so it counts 4 unique coordinates
      expect(result).toBe(4);
    });
  });

  test.describe('getAllGeoJsonCoordinates', () => {
    test('should return all coordinates from LineString', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { getAllGeoJsonCoordinates } = window.geomanUtils;
        return getAllGeoJsonCoordinates(feature);
      }, lineFeature);

      expect(result).toEqual([
        [0, 0],
        [1, 1],
        [2, 2],
      ]);
    });
  });

  test.describe('getEuclideanDistance', () => {
    test('should calculate correct distance between two screen points', async () => {
      const result = await page.evaluate(() => {
        const { getEuclideanDistance } = window.geomanUtils;
        return getEuclideanDistance([0, 0], [3, 4]);
      });
      expect(result).toBe(5); // 3-4-5 triangle
    });

    test('should return 0 for same point', async () => {
      const result = await page.evaluate(() => {
        const { getEuclideanDistance } = window.geomanUtils;
        return getEuclideanDistance([5, 5], [5, 5]);
      });
      expect(result).toBe(0);
    });
  });

  test.describe('getEuclideanSegmentNearestPoint', () => {
    test('should find nearest point on horizontal segment', async () => {
      const result = await page.evaluate(() => {
        const { getEuclideanSegmentNearestPoint } = window.geomanUtils;
        // Horizontal line from (0,0) to (10,0)
        // Target point at (5, 5) - nearest should be (5, 0)
        return getEuclideanSegmentNearestPoint([0, 0], [10, 0], [5, 5]);
      });
      expect(result[0]).toBeCloseTo(5, 5);
      expect(result[1]).toBeCloseTo(0, 5);
    });

    test('should clamp to segment start', async () => {
      const result = await page.evaluate(() => {
        const { getEuclideanSegmentNearestPoint } = window.geomanUtils;
        // Line from (0,0) to (10,0)
        // Target point at (-5, 0) - nearest should be (0, 0)
        return getEuclideanSegmentNearestPoint([0, 0], [10, 0], [-5, 0]);
      });
      expect(result[0]).toBeCloseTo(0, 5);
      expect(result[1]).toBeCloseTo(0, 5);
    });

    test('should clamp to segment end', async () => {
      const result = await page.evaluate(() => {
        const { getEuclideanSegmentNearestPoint } = window.geomanUtils;
        // Line from (0,0) to (10,0)
        // Target point at (15, 0) - nearest should be (10, 0)
        return getEuclideanSegmentNearestPoint([0, 0], [10, 0], [15, 0]);
      });
      expect(result[0]).toBeCloseTo(10, 5);
      expect(result[1]).toBeCloseTo(0, 5);
    });
  });

  test.describe('twoCoordsToGeoJsonRectangle', () => {
    test('should create correct rectangle from two coordinates', async () => {
      const result = await page.evaluate(() => {
        const { twoCoordsToGeoJsonRectangle } = window.geomanUtils;
        return twoCoordsToGeoJsonRectangle([0, 0], [10, 10]);
      });

      expect(result.type).toBe('Feature');
      expect(result.geometry.type).toBe('Polygon');
      expect(result.properties.shape).toBe('rectangle');
      // Should have 5 coordinates (closed polygon)
      if (result.geometry.type === 'Polygon') {
        expect(result.geometry.coordinates[0].length).toBe(5);
      }
    });

    test('should handle inverted coordinates', async () => {
      const result = await page.evaluate(() => {
        const { twoCoordsToGeoJsonRectangle } = window.geomanUtils;
        return twoCoordsToGeoJsonRectangle([10, 10], [0, 0]);
      });

      expect(result.type).toBe('Feature');
      expect(result.geometry.type).toBe('Polygon');
      // Should still create valid rectangle
      if (result.geometry.type === 'Polygon') {
        expect(result.geometry.coordinates[0].length).toBe(5);
      }
    });
  });

  test.describe('lngLatToGeoJsonPoint', () => {
    test('should create marker point feature', async () => {
      const result = await page.evaluate(() => {
        const { lngLatToGeoJsonPoint } = window.geomanUtils;
        return lngLatToGeoJsonPoint([10, 20], 'marker');
      });

      expect(result.type).toBe('Feature');
      expect(result.geometry.type).toBe('Point');
      expect(result.geometry.coordinates).toEqual([10, 20]);
      expect(result.properties.shape).toBe('marker');
    });

    test('should create text_marker point feature', async () => {
      const result = await page.evaluate(() => {
        const { lngLatToGeoJsonPoint } = window.geomanUtils;
        return lngLatToGeoJsonPoint([10, 20], 'text_marker');
      });

      expect(result.properties.shape).toBe('text_marker');
    });
  });

  test.describe('getCoordinateByPath', () => {
    test('should get coordinate by path in LineString', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { getCoordinateByPath } = window.geomanUtils;
        return getCoordinateByPath(feature, ['geometry', 'coordinates', 1]);
      }, lineFeature);

      expect(result).toEqual([1, 1]);
    });

    test('should return null for invalid path', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { getCoordinateByPath } = window.geomanUtils;
        return getCoordinateByPath(feature, ['geometry', 'coordinates', 99]);
      }, lineFeature);

      expect(result).toBeNull();
    });
  });

  test.describe('removeVertexFromLine', () => {
    test('should remove vertex from LineString', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { removeVertexFromLine } = window.geomanUtils;
        const removed = removeVertexFromLine(feature, [1, 1]);
        return {
          removed,
          coordinates: feature.geometry.coordinates,
        };
      }, lineFeature);

      expect(result.removed).toBe(true);
      expect(result.coordinates.length).toBe(2);
      expect(result.coordinates).toEqual([
        [0, 0],
        [2, 2],
      ]);
    });

    test('should return false for non-existent vertex', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { removeVertexFromLine } = window.geomanUtils;
        return removeVertexFromLine(feature, [5, 5]);
      }, lineFeature);

      expect(result).toBe(false);
    });
  });

  test.describe('allCoordinatesEqual', () => {
    test('should return false when all coordinates are the same', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { allCoordinatesEqual } = window.geomanUtils;
        return allCoordinatesEqual(feature);
      }, lineFeature);

      expect(result).toBe(false);
    });

    test('should return true when coordinates are different', async () => {
      const lineFeature: Feature<LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [1, 1],
          ],
        },
      };
      const result = await page.evaluate((feature) => {
        const { allCoordinatesEqual } = window.geomanUtils;
        return allCoordinatesEqual(feature);
      }, lineFeature);

      expect(result).toBe(true);
    });
  });
});
