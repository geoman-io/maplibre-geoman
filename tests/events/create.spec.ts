import test, { expect } from '@playwright/test';
import { getWindowDimensions } from '../utils/basic.ts';
import { getRenderedFeaturesData } from '../utils/features.ts';
import { setupGeomanTest, testShapeCreation } from '../utils/test-helpers.ts';

test.beforeEach(async ({ page }) => {
  await setupGeomanTest(page);
});

test('Marker create event', async ({ page }) => {
  const { width, height } = await getWindowDimensions(page);
  const centerX = width / 2;
  const centerY = height / 2;

  const result = await testShapeCreation(page, {
    shapeName: 'marker',
    points: [centerX, centerY],
  });

  expect(result.shape).toBe('marker');
  expect(result.feature).toBeTruthy();
});

test('Circle marker create event', async ({ page }) => {
  const { width, height } = await getWindowDimensions(page);
  const centerX = width / 2;
  const centerY = height / 2;

  const result = await testShapeCreation(page, {
    shapeName: 'circle_marker',
    points: [centerX, centerY],
  });

  expect(result.shape).toBe('circle_marker');
  expect(result.feature).toBeTruthy();
});

test('Text marker create event', async ({ page }) => {
  const { width, height } = await getWindowDimensions(page);
  const centerX = width / 2;
  const centerY = height / 2;

  const result = await testShapeCreation(page, {
    shapeName: 'text_marker',
    points: [centerX, centerY],
    additionalActions: async () => {
      await page.keyboard.type('Text marker');
      await page.mouse.move(centerX - 50, centerY - 50);
      await page.mouse.click(centerX - 50, centerY - 50);
    },
  });

  expect(result.shape).toBe('text_marker');
  expect(result.feature).toBeTruthy();
});

test('Circle create event', async ({ page }) => {
  const { width, height } = await getWindowDimensions(page);
  const centerX = width / 2;
  const centerY = height / 2;

  const points: Array<[number, number]> = [
    [centerX, centerY],
    [centerX + 100, centerY + 100],
  ];

  const result = await testShapeCreation(page, {
    shapeName: 'circle',
    points,
  });

  expect(result.shape).toBe('circle');
  expect(result.feature).toBeTruthy();
});

test('Rectangle create event', async ({ page }) => {
  const { width, height } = await getWindowDimensions(page);
  const startX = width / 2 - 100;
  const startY = height / 2 - 100;
  const endX = width / 2 + 100;
  const endY = height / 2 + 100;

  const points: Array<[number, number]> = [
    [startX, startY],
    [endX, endY],
  ];

  const result = await testShapeCreation(page, {
    shapeName: 'rectangle',
    points,
  });

  expect(result.shape).toBe('rectangle');
  expect(result.feature).toBeTruthy();
});

test('Line create event', async ({ page }) => {
  const { width, height } = await getWindowDimensions(page);
  const points: Array<[number, number]> = [
    [width / 2 - 100, height / 2 - 100],
    [width / 2, height / 2],
    [width / 2 + 50, height / 2 + 100],
    [width / 2 + 50, height / 2 + 100],
  ];

  const result = await testShapeCreation(page, {
    shapeName: 'line',
    points,
  });

  expect(result.shape).toBe('line');
  expect(result.feature).toBeTruthy();
});

test('Polygon create event', async ({ page }) => {
  const { width, height } = await getWindowDimensions(page);
  const points: Array<[number, number]> = [
    [width / 2 - 100, height / 2 - 100],
    [width / 2, height / 2],
    [width / 2 + 20, height / 2 + 100],
    [width / 2 - 100, height / 2 - 100],
  ];

  const result = await testShapeCreation(page, {
    shapeName: 'polygon',
    points,
  });

  await expect
    .poll(
      async () => {
        const renderedFeatures = await getRenderedFeaturesData({ page, temporary: false });
        return renderedFeatures.length;
      },
      { timeout: 10 * 1000, message: `A feature was not created within timeout` },
    )
    .toBeGreaterThan(0);

  expect(result.shape).toBe('polygon');
  expect(result.feature).toBeTruthy();
});
