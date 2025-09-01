import test, { expect, type Page } from '@playwright/test';
import { getWindowDimensions, mouseMoveAndClick, waitForGeoman } from '../utils/basic.ts';
import { type FeatureCustomData, getRenderedFeaturesData } from '../utils/features.ts';
import type { ShapeName } from '@/types';

const checkFeatureCreated = async (page: Page, featureType: ShapeName) => {
  let renderedFeatures: Array<FeatureCustomData> = [];

  await expect
    .poll(
      async () => {
        renderedFeatures = await getRenderedFeaturesData({
          page,
          temporary: false,
          allowedTypes: [featureType],
        });
        return renderedFeatures.length;
      },
      { timeout: 10 * 1000, message: 'Feature never created' },
    )
    .toEqual(1);

  expect(renderedFeatures).toHaveLength(1);
  if (renderedFeatures?.length !== 1) {
    return;
  }

  expect(renderedFeatures[0].shape).toBe(featureType);
  expect(renderedFeatures[0].temporary).toEqual(false);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');
});

test('Draw a marker', async ({ page }) => {
  // Get window dimensions
  const { width, height } = await getWindowDimensions(page);
  const centerX = width / 2;
  const centerY = height / 2;

  // Click on the draw marker button
  await page.click('#id_draw_marker');
  await mouseMoveAndClick(page, [centerX, centerY]);

  // Exit drawing mode
  await page.click('#id_draw_marker');

  await checkFeatureCreated(page, 'marker');
});

test('Draw a circle marker', async ({ page }) => {
  await page.click('#id_draw_circle_marker');

  const { innerWidth, innerHeight } = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }));
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;

  const points: Array<[number, number]> = [[centerX, centerY]];
  await mouseMoveAndClick(page, points);
  await page.click('#id_draw_circle_marker');

  await checkFeatureCreated(page, 'circle_marker');
});

test('Draw a text marker', async ({ page }) => {
  await page.click('#id_draw_text_marker');

  const { innerWidth, innerHeight } = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }));
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;
  const points: Array<[number, number]> = [[centerX, centerY]];
  await mouseMoveAndClick(page, points);

  await page.keyboard.type('Text marker');
  await page.mouse.click(centerX - 50, centerY - 50);
  await page.click('#id_draw_text_marker');

  await checkFeatureCreated(page, 'text_marker');
});

test('Draw a circle', async ({ page }) => {
  await page.click('#id_draw_circle');

  const { innerWidth, innerHeight } = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }));
  const centerX = innerWidth / 2;
  const centerY = innerHeight / 2;

  const points: Array<[number, number]> = [
    [centerX, centerY],
    [centerX + 100, centerY + 100],
  ];
  await mouseMoveAndClick(page, points);
  await page.click('#id_draw_circle');

  await checkFeatureCreated(page, 'circle');
});

test('Draw a rectangle', async ({ page }) => {
  await page.click('#id_draw_rectangle');

  const { innerWidth, innerHeight } = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }));
  const startX = innerWidth / 2 - 100;
  const startY = innerHeight / 2 - 100;
  const endX = innerWidth / 2 + 100;
  const endY = innerHeight / 2 + 100;

  const points: Array<[number, number]> = [
    [startX, startY],
    [endX, endY],
  ];
  await mouseMoveAndClick(page, points);
  await page.click('#id_draw_rectangle');

  await checkFeatureCreated(page, 'rectangle');
});

test('Draw a line', async ({ page }) => {
  await page.click('#id_draw_line');

  const { innerWidth, innerHeight } = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }));

  const points: Array<[number, number]> = [
    [innerWidth / 2 - 100, innerHeight / 2 - 100],
    [innerWidth / 2, innerHeight / 2],
    [innerWidth / 2 + 50, innerHeight / 2 + 100],
    [innerWidth / 2 + 50, innerHeight / 2 + 100],
  ];
  await mouseMoveAndClick(page, points);

  await page.click('#id_draw_line');

  await checkFeatureCreated(page, 'line');
});

test('Draw a polygon', async ({ page }) => {
  await page.click('#id_draw_polygon');

  const { innerWidth, innerHeight } = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }));

  const points: Array<[number, number]> = [
    [innerWidth / 2 - 100, innerHeight / 2 - 100],
    [innerWidth / 2, innerHeight / 2],
    [innerWidth / 2 + 20, innerHeight / 2 + 100],
    [innerWidth / 2 - 100, innerHeight / 2 - 100],
  ];
  await mouseMoveAndClick(page, points);
  await page.click('#id_draw_polygon');

  await checkFeatureCreated(page, 'polygon');
});
