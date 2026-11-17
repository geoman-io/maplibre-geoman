import test, { expect } from '@playwright/test';
import { getFeatureMarkersData, loadGeoJsonFeatures } from '@tests/utils/features.ts';
import { dragAndDrop, enableMode, waitForGeoman } from '@tests/utils/basic.ts';
import { SOURCES } from '@/core/features/constants.ts';

type MarkerSource = {
  updateData: (diff: { update?: Map<unknown, unknown> }, ...rest: unknown[]) => unknown;
};
type HandleCount = { updatedHandles: number };
type PannableMap = {
  once: (type: 'idle', listener: () => void) => unknown;
  panBy: (offset: [number, number], options: { animate: boolean }) => unknown;
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await waitForGeoman(page);
});

// Panning moves every edge midpoint by a rounding error, so a full handle refresh rewrites them all (#289).
for (const panned of [false, true]) {
  test(`Change: committing a large drag only updates the dragged handles (map ${panned ? 'panned' : 'not moved'})`, async ({
    page,
  }) => {
    const bottomVertices = 600;
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
    if (panned) {
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            const map = window.mapInstance as unknown as PannableMap;
            map.once('idle', () => resolve());
            map.panBy([50, 0], { animate: false });
          }),
      );
    }
    await page.evaluate((sourceName) => {
      // Geoman's source wrapper sees the same diff on MapLibre and Mapbox; the
      // Mapbox adapter turns it into setData, so the map source cannot be spied on.
      const source = window.geoman.features.sources[sourceName] as unknown as MarkerSource;
      const updateData = source.updateData.bind(source);
      const count = window as unknown as HandleCount;
      count.updatedHandles = 0;
      source.updateData = (diff, ...rest) => {
        count.updatedHandles += diff.update?.size ?? 0;
        return updateData(diff, ...rest);
      };
    }, SOURCES.internal);

    const path = `geometry.coordinates.0.${bottomVertices}`;
    const corner = (
      await getFeatureMarkersData({
        page,
        featureId: 'large-polygon',
        temporary: false,
        allowedTypes: ['vertex'],
      })
    ).find((marker) => marker.path?.join('.') === path);
    expect(corner).toBeDefined();
    if (!corner) return;
    const target: [number, number] = [corner.point[0] + 20, corner.point[1] - 20];
    await dragAndDrop(page, corner.point, target);
    await expect
      .poll(async () => {
        const moved = (
          await getFeatureMarkersData({
            page,
            featureId: 'large-polygon',
            temporary: false,
            allowedTypes: ['vertex'],
          })
        ).find((marker) => marker.path?.join('.') === path);
        return moved
          ? Math.hypot(moved.point[0] - target[0], moved.point[1] - target[1])
          : Infinity;
      })
      .toBeLessThanOrEqual(2);

    // The dragged vertex handle and the two adjacent edge handles.
    const updatedHandles = await page.evaluate(
      () => (window as unknown as HandleCount).updatedHandles,
    );
    expect(updatedHandles).toBe(3);
  });
}
