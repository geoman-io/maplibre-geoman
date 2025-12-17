import type { LngLatTuple } from '@/main.ts';
import type { Page } from '@playwright/test';
import { type ScreenCoordinates } from './basic.ts';

export const getScreenCoordinatesByLngLat = async ({
  page,
  position,
}: {
  page: Page;
  position: LngLatTuple;
}): Promise<ScreenCoordinates | null> => {
  return page.evaluate(
    (context) => {
      const geoman = window.geoman;
      if (!geoman.mapAdapter.mapInstance) {
        console.error('Map is not initialized');
        return null;
      }

      // Get point relative to map container
      const point = geoman.mapAdapter.project(context.position);

      // Get map container's offset from viewport to convert to viewport coordinates
      const container = geoman.mapAdapter.getContainer();
      const rect = container.getBoundingClientRect();

      return [Math.round(point[0] + rect.left), Math.round(point[1] + rect.top)];
    },
    { position },
  );
};
