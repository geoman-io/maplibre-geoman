import { expect, test } from '@playwright/test';
import { setupGeomanTest } from '@tests/utils/test-helpers.ts';
import { waitForMapIdle } from '@tests/utils/basic.ts';
import type { DrawInput } from '@/main.ts';

type Capture = { drawApiEvents: string[] };
const inputs: DrawInput[] = [
  { shape: 'marker', coordinates: [0, 0], properties: { name: 'Point' } },
  { shape: 'circle', center: [12, 70], radiusMeters: 500, properties: { name: 'Circle' } },
  { shape: 'rectangle', center: [12, 70], widthMeters: 100, heightMeters: 100, angleDegrees: 30 },
];

test.describe('Public draw API', () => {
  test.beforeEach(async ({ page }) => {
    await setupGeomanTest(page);
    await page.evaluate(async () => {
      const gm = window.geoman;
      await gm.disableAllModes();
      await gm.features.deleteAll();
      const capture = window as unknown as Capture;
      capture.drawApiEvents = [];
      gm.mapAdapter.on('gm:create', () => capture.drawApiEvents.push('create'));
      gm.mapAdapter.on('gm:drawend', () => capture.drawApiEvents.push('drawend'));
    });
    await waitForMapIdle(page);
  });

  for (const input of inputs) {
    test(`creates ${input.shape} with correct metadata and one creation event`, async ({
      page,
    }) => {
      const result = await page.evaluate(async (value) => {
        const gm = window.geoman;
        const result = await gm.draw.create(value);
        if (!result.ok) return result;
        return {
          ok: true,
          geoJson: result.feature.getGeoJson(),
          shape: result.feature.shape,
          modes: gm.getActiveDrawModes(),
          exported: gm.features.exportGeoJson(),
        };
      }, input);
      expect(result.ok).toBe(true);
      if (!('geoJson' in result)) throw new Error(JSON.stringify(result));
      expect(result.shape).toBe(input.shape);
      expect(result.modes).toEqual([]);
      expect(result.exported.features).toHaveLength(1);
      if (input.shape === 'marker')
        expect(result.geoJson.geometry).toEqual({ type: 'Point', coordinates: input.coordinates });
      else expect(result.geoJson.properties.__gm_center).toEqual(input.center);
      if (input.shape === 'rectangle') {
        expect(result.geoJson.properties.__gm_width).toBe(100);
        expect(result.geoJson.properties.__gm_height).toBe(100);
        expect(result.geoJson.properties.__gm_angle).toBe(30);
      }
      await waitForMapIdle(page);
      await expect
        .poll(() => page.evaluate(() => (window as unknown as Capture).drawApiEvents))
        .toEqual(['create']);
    });

    test(`finishes active ${input.shape} from complete input and exits drawing`, async ({
      page,
    }) => {
      const result = await page.evaluate(async (value) => {
        const gm = window.geoman;
        await gm.enableDraw(value.shape);
        const result = await gm.draw.finish(value);
        if (!result.ok) return result;
        return {
          ok: true,
          id: result.feature.id,
          shape: result.feature.shape,
          modes: gm.getActiveDrawModes(),
          features: gm.features.exportGeoJson().features.length,
          temporary: [...gm.features.featureStore.values()].filter((f) => f.temporary).length,
        };
      }, input);
      expect(result).toMatchObject({
        ok: true,
        shape: input.shape,
        modes: [],
        features: 1,
        temporary: 0,
      });
      await waitForMapIdle(page);
      await expect
        .poll(() => page.evaluate(() => (window as unknown as Capture).drawApiEvents))
        .toEqual(['create', 'drawend']);
      expect(await page.evaluate(() => window.geoman.draw.finish())).toEqual({
        ok: false,
        reason: 'no_active_draw',
      });
    });

    test(`finishes the mouse preview of ${input.shape} without form values`, async ({ page }) => {
      await page.evaluate((shape) => window.geoman.enableDraw(shape), input.shape);
      const canvas = page.locator('canvas').first();
      const bounds = await canvas.boundingBox();
      if (!bounds) throw new Error('Missing canvas');
      const x = bounds.x + bounds.width / 2;
      const y = bounds.y + bounds.height / 2;
      await page.mouse.move(x, y);
      if (input.shape !== 'marker') {
        await page.mouse.click(x, y);
        await waitForMapIdle(page);
        await page.mouse.move(x + 100, y + 80);
      }
      await waitForMapIdle(page);
      const result = await page.evaluate(async () => {
        const gm = window.geoman;
        const result = await gm.draw.finish();
        return result.ok
          ? {
              ok: true,
              shape: result.feature.shape,
              geoJson: result.feature.getGeoJson(),
              count: gm.features.exportGeoJson().features.length,
              modes: gm.getActiveDrawModes(),
            }
          : result;
      });
      expect(result).toMatchObject({ ok: true, shape: input.shape, count: 1, modes: [] });
      await waitForMapIdle(page);
      await expect
        .poll(() => page.evaluate(() => (window as unknown as Capture).drawApiEvents))
        .toEqual(['create', 'drawend']);
    });
  }

  test('keeps an incomplete draft enabled until valid form input is provided', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const gm = window.geoman;
      await gm.enableDraw('circle');
      const incomplete = await gm.draw.finish();
      const invalid = await gm.draw.finish({ shape: 'circle', center: [0, 0], radiusMeters: -10 });
      const mismatch = await gm.draw.finish({ shape: 'marker', coordinates: [0, 0] });
      const modeBefore = gm.drawEnabled('circle');
      const created = await gm.draw.finish({ shape: 'circle', center: [0, 0], radiusMeters: 50 });
      return { incomplete, invalid, mismatch, modeBefore, ok: created.ok };
    });
    expect(result).toEqual({
      incomplete: { ok: false, reason: 'incomplete_draft' },
      invalid: { ok: false, reason: 'invalid_input' },
      mismatch: { ok: false, reason: 'shape_mismatch' },
      modeBefore: true,
      ok: true,
    });
  });

  test('concurrent finishes commit only one feature', async ({ page }) => {
    const results = await page.evaluate(async () => {
      const gm = window.geoman;
      await gm.enableDraw('circle');
      const input = {
        shape: 'circle' as const,
        center: [0, 0] as [number, number],
        radiusMeters: 100,
      };
      return (await Promise.all([gm.draw.finish(input), gm.draw.finish(input)])).map((r) =>
        r.ok ? 'created' : r.reason,
      );
    });
    expect(results).toEqual(['created', 'busy']);
    expect(await page.evaluate(() => window.geoman.features.exportGeoJson().features.length)).toBe(
      1,
    );
  });

  test('rejects create during an active draw without discarding that mode', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const gm = window.geoman;
      await gm.enableDraw('rectangle');
      const result = await gm.draw.create({ shape: 'marker', coordinates: [0, 0] });
      return {
        result,
        enabled: gm.drawEnabled('rectangle'),
        count: gm.features.exportGeoJson().features.length,
      };
    });
    expect(result).toEqual({
      result: { ok: false, reason: 'active_draw' },
      enabled: true,
      count: 0,
    });
  });
});
