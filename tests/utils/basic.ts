import type { ActionType, ModeName } from '@/main.ts';
import { expect, type Page } from '@playwright/test';


export type ScreenCoordinates = [number, number];


export const waitForGeoman = async (page: Page) => {
  await page.waitForFunction(() => !!window.geoman?.loaded);
};

export const waitForMapIdle = async (page: Page) => {
  await page.waitForFunction(() => window.geoman.mapAdapter.isLoaded());
};

export const waitForLocalFunction = async (callback: () => boolean) => {
  const TICK_INTERVAL = 50;
  let timeout = 5000;

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
  const isModeEnabled = await page.evaluate((context) => {
    const geoman = window.geoman;
    geoman.options.enableMode(context.actionType, context.modeName);
    return geoman.options.isModeEnabled(context.actionType, context.modeName);
  }, { actionType, modeName });
  expect(isModeEnabled).toBeTruthy();
  await waitForMapIdle(page);
};

export const disableMode = async (page: Page, actionType: ActionType, modeName: ModeName) => {
  const isModeDisabled = await page.evaluate((context) => {
    const geoman = window.geoman;
    geoman.options.disableMode(context.actionType, context.modeName);
    return !geoman.options.isModeEnabled(context.actionType, context.modeName);
  }, { actionType, modeName });
  expect(isModeDisabled).toBeTruthy();
  await waitForMapIdle(page);
};

export const mouseMoveAndClick = async (
  page: Page,
  points: ScreenCoordinates | Array<ScreenCoordinates>,
  // waitForShapeMarkers?: boolean = false,
) => {
  const pointsConverted: ScreenCoordinates[] = Array.isArray(points[0])
    ? points as ScreenCoordinates[]
    : [points as ScreenCoordinates];

  for await (const [x, y] of pointsConverted) {
    await page.mouse.move(x, y);
    await page.mouse.click(x, y);
    await page.waitForTimeout(100);
  }
};

export const dragAndDrop = async (
  page: Page,
  startPoint: ScreenCoordinates,
  targetPoint: ScreenCoordinates,
) => {
  const STEPS = 5;

  await page.mouse.move(startPoint[0], startPoint[1]);
  await page.mouse.down();

  for (let i = 1; i <= STEPS; i++) {
    const middleX = startPoint[0] + (targetPoint[0] - startPoint[0]) * (i / STEPS);
    const middleY = startPoint[1] + (targetPoint[1] - startPoint[1]) * (i / STEPS);
    await page.mouse.move(middleX, middleY);
  }

  await page.mouse.up();
  await waitForMapIdle(page);
};

export const getWindowDimensions = async (page: Page) => {
  return page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
};
