import test, { expect, type Page } from '@playwright/test';
import {
  enableMode,
  getWindowDimensions,
  mouseMoveAndClick,
  waitForGeoman,
} from '@tests/utils/basic.ts';
import { type FeatureCustomData, getRenderedFeaturesData } from '@tests/utils/features.ts';

const isCI = !!process.env.CI;

const checkPolygonCreated = async (page: Page) => {
  let renderedFeatures: Array<FeatureCustomData> = [];

  await expect
    .poll(
      async () => {
        renderedFeatures = await getRenderedFeaturesData({
          page,
          temporary: false,
          allowedTypes: ['polygon'],
        });
        return renderedFeatures.length;
      },
      { timeout: 10 * 1000, message: 'Polygon feature was never created' },
    )
    .toEqual(1);

  expect(renderedFeatures[0].shape).toBe('polygon');
  expect(renderedFeatures[0].temporary).toEqual(false);
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');
});

test('Close polygon by clicking within snapping tolerance but outside marker DOM element', async ({
  page,
}) => {
  const { width, height } = await getWindowDimensions(page);
  const centerX = width / 2;
  const centerY = height / 2;

  // Define the three vertices of a triangle, well-spaced apart
  const firstVertex: [number, number] = [centerX, centerY - 100];
  const secondVertex: [number, number] = [centerX + 100, centerY + 100];
  const thirdVertex: [number, number] = [centerX - 100, centerY + 100];

  // Enable snapping helper, then polygon draw mode
  await enableMode(page, 'helper', 'snapping');
  await enableMode(page, 'draw', 'polygon');

  // Draw the first three vertices of the polygon
  await mouseMoveAndClick(page, [firstVertex, secondVertex, thirdVertex]);

  // Now attempt to close the polygon by clicking near the first vertex,
  // within the snapping tolerance (18px) but outside the marker DOM element (~10.5px radius).
  // An offset of 14px is inside the 18px snapping zone but outside the 10.5px marker.
  const closeOffset = 14;
  const closePoint: [number, number] = [firstVertex[0] + closeOffset, firstVertex[1]];

  // Move to the close point first to trigger snapping
  await page.mouse.move(closePoint[0], closePoint[1]);
  await page.waitForTimeout(isCI ? 200 : 100);

  // Click at the close point - snapping should snap to first vertex and close the polygon
  await page.mouse.click(closePoint[0], closePoint[1]);
  await page.waitForTimeout(isCI ? 200 : 100);

  // Disable polygon draw mode
  await enableMode(page, 'draw', 'polygon');

  // Assert that a polygon feature was created (meaning the polygon was successfully closed)
  await checkPolygonCreated(page);
});
