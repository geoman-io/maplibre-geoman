import type { ActionType, ModeName } from '@/main.ts';
import { expect, type Page } from '@playwright/test';

export type ScreenCoordinates = [number, number];

// Helper to determine if we're in CI
const isCI = !!process.env.CI;

// Configure page timeouts for CI
export const configurePageTimeouts = async (page: Page) => {
  if (isCI) {
    page.setDefaultTimeout(60000); // 60 seconds for CI
    page.setDefaultNavigationTimeout(60000);
  }
};

export const waitForGeoman = async (page: Page) => {
  await page.waitForFunction(() => !!window.geoman?.loaded, { timeout: isCI ? 30000 : 10000 });
};

export const waitForMapIdle = async (page: Page) => {
  await page.waitForFunction(
    () => {
      return !Object.values(window.geoman.features.sources).some((source) => !source?.loaded);
    },
    {
      timeout: isCI ? 30000 : 10000,
    },
  );
};

export const waitForLocalFunction = async (callback: () => boolean) => {
  const TICK_INTERVAL = 50;
  let timeout = isCI ? 15000 : 5000; // Increased timeout for CI

  await new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      timeout -= TICK_INTERVAL;
      if (callback()) {
        clearInterval(interval);
        resolve(true);
      } else if (timeout <= 0) {
        clearInterval(interval);
        reject(new Error('Timeout'));
      }
    }, TICK_INTERVAL);
  });
};

export const enableMode = async (page: Page, actionType: ActionType, modeName: ModeName) => {
  const isModeEnabled = await page.evaluate(
    (context) => {
      const geoman = window.geoman;
      geoman.options.enableMode(context.actionType, context.modeName);
      return geoman.options.isModeEnabled(context.actionType, context.modeName);
    },
    { actionType, modeName },
  );
  expect(isModeEnabled).toBeTruthy();
  await waitForMapIdle(page);
};

export const disableMode = async (page: Page, actionType: ActionType, modeName: ModeName) => {
  const isModeDisabled = await page.evaluate(
    (context) => {
      const geoman = window.geoman;
      geoman.options.disableMode(context.actionType, context.modeName);
      return !geoman.options.isModeEnabled(context.actionType, context.modeName);
    },
    { actionType, modeName },
  );
  expect(isModeDisabled).toBeTruthy();
  await waitForMapIdle(page);
};

export const mouseMoveAndClick = async (
  page: Page,
  points: ScreenCoordinates | Array<ScreenCoordinates>,
  // waitForShapeMarkers?: boolean = false,
) => {
  const pointsConverted: ScreenCoordinates[] = Array.isArray(points[0])
    ? (points as ScreenCoordinates[])
    : [points as ScreenCoordinates];

  for await (const [x, y] of pointsConverted) {
    await page.mouse.move(x, y);
    if (isCI) await page.waitForTimeout(50); // Add delay for CI stability
    await page.mouse.click(x, y);
    await page.waitForTimeout(isCI ? 200 : 100); // Increased delay for CI
  }
};

export const dragAndDrop = async (
  page: Page,
  startPoint: ScreenCoordinates,
  targetPoint: ScreenCoordinates,
) => {
  const STEPS = isCI ? 10 : 5; // More steps for smoother CI operation
  const STEP_DELAY = isCI ? 50 : 5; // Add delay between steps in CI

  await page.mouse.move(startPoint[0], startPoint[1]);
  if (isCI) await page.waitForTimeout(100); // Extra delay before mouse down in CI
  await page.mouse.down();

  for (let i = 1; i <= STEPS; i++) {
    const middleX = startPoint[0] + (targetPoint[0] - startPoint[0]) * (i / STEPS);
    const middleY = startPoint[1] + (targetPoint[1] - startPoint[1]) * (i / STEPS);
    await page.mouse.move(middleX, middleY);
    if (STEP_DELAY > 0) {
      await page.waitForTimeout(STEP_DELAY);
    }
  }

  await page.mouse.up();
  if (isCI) await page.waitForTimeout(200); // Extra delay after mouse up in CI
  await waitForMapIdle(page);
};

export const getWindowDimensions = async (page: Page) => {
  return page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
};
