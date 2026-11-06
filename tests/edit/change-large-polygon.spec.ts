import test, { expect } from '@playwright/test';
import { getFeatureMarkersData, loadGeoJsonFeatures } from '@tests/utils/features.ts';
import { dragAndDrop, enableMode, waitForGeoman } from '@tests/utils/basic.ts';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await waitForGeoman(page);
});

// The threshold counts distinct positions, excluding the ring's closing coordinate.
for (const bottomVertices of [100, 509, 510, 600]) {
  test(`Change: committed handles follow the vertex (${bottomVertices + 3} positions)`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const ring = await page.evaluate((n) => {
      const at = (x: number, y: number) => window.geoman.mapAdapter.unproject([x, y]);
      const bottom = Array.from({ length: n }, (_, k) => at(300 + (400 * k) / (n - 1), 500));
      return [...bottom, at(700, 300), at(300, 300), bottom[0]];
    }, bottomVertices);
    await loadGeoJsonFeatures({
      page,
      geoJsonFeatures: [
        {
          id: 'large-polygon',
          type: 'Feature',
          properties: { shape: 'polygon' },
          geometry: { type: 'Polygon', coordinates: [ring] },
        },
      ],
    });
    await enableMode(page, 'edit', 'change');
    const path = `geometry.coordinates.0.${bottomVertices}`;
    const markers = () =>
      getFeatureMarkersData({
        page,
        featureId: 'large-polygon',
        temporary: false,
        allowedTypes: ['vertex'],
      });
    const corner = (await markers()).find((marker) => marker.path?.join('.') === path);
    expect(corner).toBeDefined();
    if (!corner) return;
    let start = corner.point;
    // A second drag proves the committed handle can actually be grabbed again.
    for (let drag = 0; drag < 2; drag += 1) {
      const target: [number, number] = [start[0] + 20, start[1] - 20];
      await dragAndDrop(page, start, target);
      await expect
        .poll(async () => {
          const moved = (await markers()).find((marker) => marker.path?.join('.') === path);
          return moved
            ? Math.hypot(moved.point[0] - target[0], moved.point[1] - target[1])
            : Infinity;
        })
        .toBeLessThanOrEqual(2);
      await expect
        .poll(() =>
          page.evaluate(
            ({ n, target }) => {
              const gm = window.geoman;
              const feature = gm.features.get(gm.features.defaultSourceName, 'large-polygon');
              if (!feature || feature.getGeoJson().geometry.type !== 'Polygon') return Infinity;
              const geometry = feature.getGeoJson().geometry;
              if (geometry.type !== 'Polygon') return Infinity;
              const vertex = gm.mapAdapter.project(geometry.coordinates[0][n] as [number, number]);
              let distance = Math.hypot(vertex[0] - target[0], vertex[1] - target[1]);
              for (const index of [n - 1, n]) {
                const marker = feature.markers.get(`edge.${index}`);
                if (!marker || marker.type !== 'edge') return Infinity;
                const a = gm.mapAdapter.project(geometry.coordinates[0][index] as [number, number]);
                const b = gm.mapAdapter.project(
                  geometry.coordinates[0][index + 1] as [number, number],
                );
                const point = gm.mapAdapter.project(
                  marker.instance.getGeoJson().geometry.coordinates as [number, number],
                );
                distance = Math.max(
                  distance,
                  Math.hypot(point[0] - (a[0] + b[0]) / 2, point[1] - (a[1] + b[1]) / 2),
                );
              }
              return distance;
            },
            { n: bottomVertices, target },
          ),
        )
        .toBeLessThanOrEqual(2);
      start = target;
    }
    expect(errors).toEqual([]);
  });
}
