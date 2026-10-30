import { expect, test } from '@playwright/test';
import type { DrawPolygon } from '@/modes/draw/polygon.ts';
import { waitForGeoman } from '@tests/utils/basic.ts';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await waitForGeoman(page);
});

for (const firstVertex of [true, false]) {
  test(`polygon veto keeps the draft open when closing on the ${firstVertex ? 'first' : 'last'} vertex`, async ({
    page,
  }) => {
    const result = await page.evaluate(async (first) => {
      const gm = window.geoman;
      await gm.enableMode('draw', 'polygon');
      const drawer = (gm.actionInstances.draw__polygon as DrawPolygon).lineDrawer;
      await drawer.startShape([-2, 51]);
      await drawer.addPoint([2, 51], { index: -1, path: null });
      await drawer.addPoint([0, 54], { index: -1, path: null });
      const draft = drawer.featureData;
      const rejected: string[] = [];
      gm.setGlobalEventsListener((event) => {
        if (event.name === 'gm:draw:rejected') rejected.push(event.reason);
      });
      gm.options.settings.beforeChange = () => false;
      await drawer.handleNextVertex(first ? [-2, 51] : [0, 54], {
        index: first ? 0 : 2,
        path: null,
      });
      return {
        count: gm.features.exportGeoJson().features.length,
        sameDraft: drawer.featureData === draft,
        vertices: drawer.shapeLngLats.length,
        rejected,
      };
    }, firstVertex);
    expect(result).toEqual({
      count: 0,
      sameDraft: true,
      vertices: 3,
      rejected: ['creation_rejected'],
    });
  });
}

for (const gate of ['closing-vertex', 'finished-polygon'] as const) {
  test(`cancelling and restarting during the ${gate} hook cannot finish the old polygon`, async ({
    page,
  }) => {
    const result = await page.evaluate(async (pendingGate) => {
      const gm = window.geoman;
      await gm.enableMode('draw', 'polygon');
      const drawer = (gm.actionInstances.draw__polygon as DrawPolygon).lineDrawer;
      await drawer.startShape([-2, 51]);
      await drawer.addPoint([2, 51], { index: -1, path: null });
      await drawer.addPoint([0, 54], { index: -1, path: null });
      let release!: (allowed: boolean) => void;
      let entered!: () => void;
      const hookEntered = new Promise<void>((resolve) => {
        entered = resolve;
      });
      const allowed = new Promise<boolean>((resolve) => {
        release = resolve;
      });
      gm.options.settings.beforeChange = ({ geometry }) => {
        const finalPolygon = geometry?.type === 'MultiPolygon';
        if (finalPolygon === (pendingGate === 'finished-polygon')) {
          entered();
          return allowed;
        }
        return true;
      };
      const finish = drawer.handleNextVertex([-2, 51], { index: 0, path: null });
      await hookEntered;
      await gm.disableMode('draw', 'polygon');
      gm.options.settings.beforeChange = () => true;
      await gm.enableMode('draw', 'polygon');
      const restarted = (gm.actionInstances.draw__polygon as DrawPolygon).lineDrawer;
      await restarted.startShape([10, 51]);
      const newDraft = restarted.featureData;
      release(true);
      await finish;
      return {
        count: gm.features.exportGeoJson().features.length,
        sameDraft: restarted.featureData === newDraft,
        vertices: restarted.shapeLngLats,
      };
    }, gate);
    expect(result).toEqual({ count: 0, sameDraft: true, vertices: [[10, 51]] });
  });
}
