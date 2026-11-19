import test, { expect } from '@playwright/test';
import distance from '@turf/distance';
import { configurePageTimeouts, enableMode, waitForGeoman } from '@tests/utils/basic.ts';
import { getScreenCoordinatesByLngLat } from '@tests/utils/shapes.ts';
import type { Polygon, Position } from 'geojson';
import type { EditDrag } from '@/modes/edit/drag.ts';

const edgeLengths = (geometry: Polygon): number[] =>
  geometry.coordinates.flatMap((ring) =>
    ring
      .slice(0, -1)
      .map((position, index) => distance(position, ring[index + 1], { units: 'meters' })),
  );

test('body drag preserves shared closing positions in an imported polygon and its hole', async ({
  page,
}) => {
  await configurePageTimeouts(page);
  await page.goto('/');
  await waitForGeoman(page);
  const before = await page.evaluate(async () => {
    const outerStart = [-0.5, 50.8, 25];
    const holeStart = [0.2, 51, 25];
    const geometry: Polygon = {
      type: 'Polygon',
      coordinates: [
        [outerStart, [0.5, 50.8, 25], [0.5, 51.2, 25], [-0.5, 51.2, 25], outerStart],
        [holeStart, [0.2, 51.1, 25], [0.35, 51.1, 25], [0.35, 51, 25], holeStart],
      ],
    };
    const feature = await window.geoman.features.importGeoJsonFeature({
      type: 'Feature',
      id: 'shared-closure',
      properties: { name: 'Shared closure parcel' },
      geometry,
    });
    if (!feature) throw new Error('Polygon import failed');
    const map = window.geoman.mapAdapter.getMapInstance() as {
      fitBounds: (bounds: number[][], options: { padding: number; duration: number }) => void;
    };
    map.fitBounds(
      [
        [-0.6, 50.7],
        [0.6, 51.3],
      ],
      { padding: 80, duration: 0 },
    );
    const stored = feature.getGeoJson().geometry as Polygon;
    return {
      geometry: stored,
      shared: stored.coordinates.every((ring) => ring[0] === ring[ring.length - 1]),
    };
  });
  expect(before.shared).toBe(true);
  await enableMode(page, 'edit', 'drag');
  const point = await getScreenCoordinatesByLngLat({ page, position: [-0.15, 50.95] });
  if (!point) throw new Error('Map projection unavailable');
  const originalLengths = edgeLengths(before.geometry);
  await page.mouse.move(point[0], point[1]);
  await page.mouse.down();
  await page.waitForFunction(
    () => window.geoman.actionInstances.edit__drag?.flags.actionInProgress,
  );
  await page.mouse.move(point[0] + 40, point[1] + 25, { steps: 20 });
  await page.mouse.up();
  await page.waitForFunction(
    () => !(window.geoman.actionInstances.edit__drag as EditDrag).featureData,
  );
  const moved = await page.evaluate(() => {
    const feature = window.geoman.features.get('gm_main', 'shared-closure');
    if (!feature) throw new Error('Dragged feature was lost');
    return feature.getGeoJson().geometry as Polygon;
  });
  for (const ring of moved.coordinates) {
    expect(ring[0]).toEqual(ring[ring.length - 1]);
    expect(ring.every((position: Position) => position[2] === 25)).toBe(true);
  }
  edgeLengths(moved).forEach((length, index) => {
    expect(Math.abs(length - originalLengths[index]) / originalLengths[index]).toBeLessThan(0.001);
  });
  expect(moved.coordinates[0][0]).not.toEqual(before.geometry.coordinates[0][0]);
});
