import type { LngLat } from '@/main.ts';
import type { Page } from '@playwright/test';
import { type ScreenCoordinates } from './basic.ts';

export const getScreenCoordinatesByLngLat = async ({
  page,
  position,
}: {
  page: Page;
  position: LngLat;
}): Promise<ScreenCoordinates | null> => {
  return page.evaluate(
    (context) => {
      const geoman = window.geoman;
      if (!geoman.mapAdapter.mapInstance) {
        console.error('Map is not initialized');
        return null;
      }

      const point = geoman.mapAdapter.project(context.position);
      return [Math.round(point[0]), Math.round(point[1])];
    },
    { position },
  );
};
