import type { FeatureCreatedFwdEvent, ModeName } from '@/main.ts';
import { expect, type Page } from '@playwright/test';
import { enableMode, mouseMoveAndClick, waitForGeoman } from './basic.ts';
import { getGeomanEventResultById, saveGeomanEventResultToCustomData } from './events.ts';
import { loadGeoJsonFeatures } from './features.ts';
import { loadGeoJson } from './fixtures.ts';

export const testShapeCreation = async (
  page: Page,
  options: {
    shapeName: ModeName;
    points: Array<[number, number]> | [number, number];
    additionalActions?: () => Promise<void>;
    exitButtonId?: string;
  },
) => {
  const { shapeName, points, additionalActions, exitButtonId = `#id_draw_${shapeName}` } = options;

  // Create event handler promise
  const createEventResultId = await saveGeomanEventResultToCustomData(page, 'create');

  // Enable drawing mode
  await enableMode(page, 'draw', shapeName);

  // Draw the shape
  await mouseMoveAndClick(page, points);

  // Perform any additional actions (like typing text)
  if (additionalActions) {
    await additionalActions();
  }

  // Wait for and verify the event
  const event = (await getGeomanEventResultById(page, createEventResultId)) as
    | FeatureCreatedFwdEvent
    | undefined;
  expect(event, 'Retrieved event result must be defined').toBeDefined();

  if (event) {
    expect(event.shape, `Shape should be ${shapeName}`).toBe(shapeName);
    expect(event.feature, 'Feature should be created').toBeTruthy();

    // Exit drawing mode
    await page.click(exitButtonId);
    return event;
  }

  throw new Error('Event must be defined');
};

export const setupGeomanTest = async (
  page: Page,
  options: {
    loadFixture?: string;
  } = {},
) => {
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');

  // Optionally load fixtures
  if (options.loadFixture) {
    const geoJsonFeatures = await loadGeoJson(options.loadFixture);
    expect(geoJsonFeatures, 'GeoJSON features should be loaded').not.toBeNull();

    if (geoJsonFeatures) {
      await loadGeoJsonFeatures({ page, geoJsonFeatures });
    }
  }
};
