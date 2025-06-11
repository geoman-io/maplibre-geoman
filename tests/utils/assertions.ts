import { expect } from '@playwright/test';
import { type ScreenCoordinates } from './basic.ts';

export const expectCoordinatesWithinTolerance = (
  actual: ScreenCoordinates | null,
  expected: ScreenCoordinates,
  tolerance: number = 2,
  message: string = 'Screen coordinates should be within tolerance'
) => {
  expect(actual, message).not.toBeNull();
  
  if (actual) {
    expect(actual[0]).toBeGreaterThanOrEqual(expected[0] - tolerance);
    expect(actual[0]).toBeLessThanOrEqual(expected[0] + tolerance);
    expect(actual[1]).toBeGreaterThanOrEqual(expected[1] - tolerance);
    expect(actual[1]).toBeLessThanOrEqual(expected[1] + tolerance);
  }
};
