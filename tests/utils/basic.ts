import type { ModeName, ModeType } from '@/main.ts';
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
    async () => {
      const geoman = window.geoman;
      if (!geoman) {
        return null;
      }

      const sources = geoman.features.sources || null;
      for (const source of Object.values(sources)) {
        if (source) {
          await geoman.features.updateManager.waitForPendingUpdates(source.id);
        } else {
          return null;
        }
      }
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

export const enableMode = async (page: Page, modeType: ModeType, modeName: ModeName) => {
  const isModeEnabled = await page.evaluate(
    async (context) => {
      const geoman = window.geoman;
      await geoman.options.enableMode(context.modeType, context.modeName);
      return geoman.options.isModeEnabled(context.modeType, context.modeName);
    },
    { modeType, modeName },
  );
  expect(isModeEnabled).toBeTruthy();
  await waitForMapIdle(page);
};

export const disableMode = async (page: Page, modeType: ModeType, modeName: ModeName) => {
  const isModeDisabled = await page.evaluate(
    async (context) => {
      const geoman = window.geoman;
      await geoman.options.disableMode(context.modeType, context.modeName);
      return !geoman.options.isModeEnabled(context.modeType, context.modeName);
    },
    { modeType, modeName },
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
  await page.mouse.move(startPoint[0], startPoint[1]);
  await page.mouse.down();
  await page.mouse.move(targetPoint[0], targetPoint[1], { steps: 10 });
  await page.mouse.up();
  await waitForMapIdle(page);
};

export const getWindowDimensions = async (page: Page) => {
  return page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
};
