import test, { expect } from '@playwright/test';
import { waitForGeoman, waitForMapIdle } from '@tests/utils/basic.ts';

for (const pixelRatio of [1, 2]) {
  test(`marker preview uses the temporary custom image at pixel ratio ${pixelRatio}`, async ({
    page,
  }) => {
    await page.goto('/');
    await waitForGeoman(page);
    await page.evaluate(async (ratio) => {
      const map = window.mapInstance;
      await window.geoman.destroy({ removeSources: true });
      const data = new Uint8Array(40 * 60 * 4);
      for (let offset = 0; offset < data.length; offset += 4) {
        data.set([255, 0, 128, 255], offset);
      }
      map.addImage('custom-marker', { width: 40, height: 60, data }, { pixelRatio: ratio });
      map.addImage('main-marker', {
        width: 1,
        height: 1,
        data: new Uint8Array([0, 0, 255, 255]),
      });
      window.geoman = new window.GeomanClass(map, {
        layerStyles: {
          marker: {
            gm_main: [{ type: 'symbol', layout: { 'icon-image': 'main-marker', 'icon-size': 1 } }],
            gm_temporary: [
              {
                type: 'symbol',
                layout: {
                  'icon-image': 'custom-marker',
                  'icon-size': 0.5,
                  'icon-anchor': 'center',
                  'icon-allow-overlap': true,
                },
                paint: { 'icon-opacity': 0.5 },
              },
            ],
          },
        },
      });
    }, pixelRatio);
    await waitForGeoman(page);
    await page.evaluate(() => window.geoman.enableMode('draw', 'marker'));
    await page.mouse.move(500, 350);

    const preview = await page.evaluate(() => {
      const element = window.geoman.markerPointer.marker?.getElement();
      const canvas =
        element instanceof HTMLCanvasElement ? element : element?.querySelector('canvas');
      if (!canvas) return null;
      return {
        width: canvas.style.width,
        height: canvas.style.height,
        opacity: canvas.style.opacity,
        pixel: Array.from(canvas.getContext('2d')!.getImageData(0, 0, 1, 1).data),
        centered: element?.className.includes('marker-anchor-center'),
      };
    });
    expect(preview).toEqual({
      width: `${20 / pixelRatio}px`,
      height: `${30 / pixelRatio}px`,
      opacity: '0.5',
      pixel: [255, 0, 128, 255],
      centered: true,
    });

    await page.mouse.click(500, 350);
    await waitForMapIdle(page);
    expect(await page.evaluate(() => window.geoman.features.exportGeoJson().features.length)).toBe(
      1,
    );
    await page.evaluate(() => window.geoman.disableMode('draw', 'marker'));
    expect(await page.evaluate(() => window.geoman.markerPointer.marker)).toBeNull();
    expect(await page.locator('canvas').count()).toBe(1);
  });
}

test('an unavailable custom image falls back and is picked up on the next draw session', async ({
  page,
}) => {
  await page.goto('/');
  await waitForGeoman(page);
  await page.evaluate(async () => {
    const map = window.mapInstance;
    await window.geoman.destroy({ removeSources: true });
    window.geoman = new window.GeomanClass(map, {
      layerStyles: {
        marker: {
          gm_temporary: [
            {
              type: 'symbol',
              layout: { 'icon-image': 'late-marker', 'icon-size': 1 },
            },
          ],
        },
      },
    });
  });
  await waitForGeoman(page);
  await page.evaluate(() => window.geoman.enableMode('draw', 'marker'));
  await expect(page.locator('.marker-wrapper svg')).toHaveCount(1);
  await page.evaluate(async () => {
    await window.geoman.disableMode('draw', 'marker');
    window.mapInstance.addImage('late-marker', {
      width: 1,
      height: 1,
      data: new Uint8Array([255, 0, 0, 255]),
    });
    await window.geoman.enableMode('draw', 'marker');
  });
  await expect(page.locator('.marker-wrapper svg')).toHaveCount(0);
  await expect(page.locator('.marker-wrapper canvas')).toHaveCount(1);
});
