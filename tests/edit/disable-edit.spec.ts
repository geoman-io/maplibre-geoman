import test, { expect } from '@playwright/test';
import { configurePageTimeouts, enableMode, waitForGeoman } from '../utils/basic.ts';
import { getRenderedFeaturesData, loadGeoJsonFeatures } from '../utils/features.ts';
import type {GeoJsonImportFeature} from "@/types";

test.beforeEach(async ({ page }) => {
  await configurePageTimeouts(page);
  await page.goto('/');
  await waitForGeoman(page);
  await expect(page).toHaveTitle('Geoman plugin');

  // Load test features with one having disableEdit set to true
  const geoJsonFeatures: GeoJsonImportFeature[] = [
    {
      "type": "Feature",
      "properties": {
        "shape": "polygon",
        "_gm": {
          "disableEdit": true
        }
      },
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-8.254465626119668, 50.69202634205437],
              [-6.991107273058219, 51.523564916277934],
              [-6.734197478886813, 49.916245874621985],
              [-8.254465626119668, 50.69202634205437]
            ]
          ]
        ]
      },
      "id": 1
    },
    {
      "type": "Feature",
      "properties": {
        "shape": "polygon"
      },
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [
          [
            [
              [-1.932737847551266, 50.61330359263574],
              [-1.5111016643663788, 49.03146999896059],
              [1.2390954813033659, 49.01221587878855],
              [-1.932737847551266, 50.61330359263574]
            ]
          ]
        ]
      },
      "id": 2
    }
  ];

  await loadGeoJsonFeatures({ page, geoJsonFeatures });
});

test('Feature with disableEdit has correct editDisabled property', async ({ page }) => {
  const features = await getRenderedFeaturesData({ page, temporary: false });
  expect(features).toHaveLength(2);

  // Test that the editDisabled property is correctly set
  const result = await page.evaluate(() => {
    const geoman = window.geoman;
    
    const disabledFeatureData = geoman.features.get(geoman.features.defaultSourceName, 1);
    const editableFeatureData = geoman.features.get(geoman.features.defaultSourceName, 2);

    if (!disabledFeatureData || !editableFeatureData) {
      return { error: 'Features not found' };
    }

    return {
      disabledEditDisabled: disabledFeatureData.editDisabled,
      editableEditDisabled: editableFeatureData.editDisabled,
      disabledGmProperties: disabledFeatureData.gmProperties,
      editableGmProperties: editableFeatureData.gmProperties,
      disabledFeature: disabledFeatureData
    };
  });

  expect(result.disabledEditDisabled).toBe(true);
  expect(result.editableEditDisabled).toBe(false);
  expect(result.disabledGmProperties?.disableEdit).toBe(true);
  expect(result.editableGmProperties?.disableEdit).toBe(false);
});

test('Feature with disableEdit does not show edit markers', async ({ page }) => {
  await enableMode(page, 'edit', 'change');
  
  // Check that edit markers are not added for the disabled feature
  const markersCount = await page.evaluate(() => {
    const geoman = window.geoman;
    const disabledFeature = geoman.features.get(geoman.features.defaultSourceName, 1);
    const editableFeature = geoman.features.get(geoman.features.defaultSourceName, 2);
    
    return {
      disabledFeatureMarkers: disabledFeature ? disabledFeature.markers.size : 0,
      editableFeatureMarkers: editableFeature ? editableFeature.markers.size : 0
    };
  });

  expect(markersCount.disabledFeatureMarkers).toBe(0); // no markers for disabled feature
  expect(markersCount.editableFeatureMarkers).toBeGreaterThan(0); // markers for editable feature
});