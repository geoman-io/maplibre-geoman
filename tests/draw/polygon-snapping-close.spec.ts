import test, { expect, type Page } from '@playwright/test';
import {
  enableMode,
  getWindowDimensions,
  mouseMoveAndClick,
  waitForGeoman,
  type ScreenCoordinates,
} from '@tests/utils/basic.ts';
import { type FeatureCustomData, getRenderedFeaturesData } from '@tests/utils/features.ts';

const isCI = !!process.env.CI;

const getPolygonFeatures = async (page: Page) => {
  return getRenderedFeaturesData({
    page,
    temporary: false,
    allowedTypes: ['polygon'],
  });
};

const checkPolygonCreated = async (page: Page) => {
  let renderedFeatures: Array<FeatureCustomData> = [];

  await expect
    .poll(
      async () => {
        renderedFeatures = await getPolygonFeatures(page);
        return renderedFeatures.length;
      },
      { timeout: 10 * 1000, message: 'Polygon feature was never created' },
    )
    .toEqual(1);

  expect(renderedFeatures[0].shape).toBe('polygon');
  expect(renderedFeatures[0].temporary).toEqual(false);
};

const checkNoPolygonCreated = async (page: Page) => {
  // Wait a bit to ensure no polygon was created asynchronously
  await page.waitForTimeout(isCI ? 500 : 300);

  const features = await getPolygonFeatures(page);
  expect(features.length).toEqual(0);
};

/**
 * Draws 3 vertices of a triangle (a polygon in progress).
 * Returns the first vertex coordinates for use in close-click tests.
 */
const drawTriangleVertices = async (page: Page) => {
  const { width, height } = await getWindowDimensions(page);
  const centerX = width / 2;
  const centerY = height / 2;

  const firstVertex: ScreenCoordinates = [centerX, centerY - 100];
  const secondVertex: ScreenCoordinates = [centerX + 100, centerY + 100];
  const thirdVertex: ScreenCoordinates = [centerX - 100, centerY + 100];

  await mouseMoveAndClick(page, [firstVertex, secondVertex, thirdVertex]);

  return { firstVertex, secondVertex, thirdVertex };
};

/**
 * Moves near a point and clicks, with a wait for snapping to settle.
 */
const moveAndClickNear = async (
  page: Page,
  target: ScreenCoordinates,
  offsetX: number,
  offsetY: number = 0,
) => {
  const clickPoint: ScreenCoordinates = [target[0] + offsetX, target[1] + offsetY];
  await page.mouse.move(clickPoint[0], clickPoint[1]);
  await page.waitForTimeout(isCI ? 200 : 100);
  await page.mouse.click(clickPoint[0], clickPoint[1]);
  await page.waitForTimeout(isCI ? 200 : 100);
};

/**
 * Sets the snapDistance setting on the geoman instance.
 */
const setSnapDistance = async (page: Page, distance: number) => {
  await page.evaluate((dist) => {
    window.geoman.options.settings.snapDistance = dist;
  }, distance);
};

/**
 * Gets the current snapDistance setting from the geoman instance.
 */
const getSnapDistance = async (page: Page): Promise<number> => {
  return page.evaluate(() => {
    return window.geoman.options.settings.snapDistance;
  });
};

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');
});

test.describe('Polygon close with snapping', () => {
  test('should close polygon when clicking within snapping tolerance but outside marker DOM', async ({
    page,
  }) => {
    await enableMode(page, 'helper', 'snapping');
    await enableMode(page, 'draw', 'polygon');

    const { firstVertex } = await drawTriangleVertices(page);

    // Click 14px from first vertex: inside 18px snapping tolerance, outside ~10.5px marker DOM
    await moveAndClickNear(page, firstVertex, 14);

    await enableMode(page, 'draw', 'polygon');
    await checkPolygonCreated(page);
  });

  test('should NOT close polygon when clicking outside snapping tolerance', async ({ page }) => {
    await enableMode(page, 'helper', 'snapping');
    await enableMode(page, 'draw', 'polygon');

    const { firstVertex } = await drawTriangleVertices(page);

    // Click 25px from first vertex: outside the default 18px snapping tolerance
    await moveAndClickNear(page, firstVertex, 25);

    // Should NOT have created a polygon (click was too far for snapping)
    await checkNoPolygonCreated(page);
  });

  test('should close polygon when clicking directly on the marker DOM with snapping enabled', async ({
    page,
  }) => {
    await enableMode(page, 'helper', 'snapping');
    await enableMode(page, 'draw', 'polygon');

    const { firstVertex } = await drawTriangleVertices(page);

    // Click exactly on the first vertex (directly on the marker DOM element)
    await moveAndClickNear(page, firstVertex, 0);

    await enableMode(page, 'draw', 'polygon');
    await checkPolygonCreated(page);
  });

  test('should close polygon when clicking on marker DOM without snapping', async ({ page }) => {
    // Do NOT enable snapping helper
    await enableMode(page, 'draw', 'polygon');

    const { firstVertex } = await drawTriangleVertices(page);

    // Click exactly on the first vertex (directly on the marker DOM element)
    await moveAndClickNear(page, firstVertex, 0);

    await enableMode(page, 'draw', 'polygon');
    await checkPolygonCreated(page);
  });
});

test.describe('Configurable snapDistance setting', () => {
  test('should default to 18px snap distance', async ({ page }) => {
    const snapDistance = await getSnapDistance(page);
    expect(snapDistance).toEqual(18);
  });

  test('should allow setting custom snapDistance at runtime', async ({ page }) => {
    await setSnapDistance(page, 30);
    const snapDistance = await getSnapDistance(page);
    expect(snapDistance).toEqual(30);
  });

  test('should close polygon at extended range with larger snapDistance', async ({ page }) => {
    // Increase snap distance to 30px
    await setSnapDistance(page, 30);

    await enableMode(page, 'helper', 'snapping');
    await enableMode(page, 'draw', 'polygon');

    const { firstVertex } = await drawTriangleVertices(page);

    // Click 25px from first vertex: outside default 18px but inside new 30px tolerance
    await moveAndClickNear(page, firstVertex, 25);

    await enableMode(page, 'draw', 'polygon');
    await checkPolygonCreated(page);
  });

  test('should NOT close polygon when outside reduced snapDistance', async ({ page }) => {
    // Reduce snap distance to 10px
    await setSnapDistance(page, 10);

    await enableMode(page, 'helper', 'snapping');
    await enableMode(page, 'draw', 'polygon');

    const { firstVertex } = await drawTriangleVertices(page);

    // Click 14px from first vertex: inside default 18px but OUTSIDE new 10px tolerance
    await moveAndClickNear(page, firstVertex, 14);

    // Should NOT have created a polygon (click was outside reduced tolerance)
    await checkNoPolygonCreated(page);
  });

  test('should respect snapDistance set via initialization options', async ({ page }) => {
    // Set snap distance via the settings API before enabling modes
    await setSnapDistance(page, 30);

    await enableMode(page, 'helper', 'snapping');
    await enableMode(page, 'draw', 'polygon');

    const { firstVertex } = await drawTriangleVertices(page);

    // Click 25px from first vertex: only works with snapDistance=30
    await moveAndClickNear(page, firstVertex, 25);

    await enableMode(page, 'draw', 'polygon');
    await checkPolygonCreated(page);
  });
});
