import test, { expect, type Page } from '@playwright/test';
import { waitForGeoman } from '@tests/utils/basic.ts';

// Custom controls are host-defined buttons rendered as an extra control group.
// They run an arbitrary `onClick` handler instead of toggling a built-in mode,
// and can be managed at run time via gm.control.addCustomControl()/removeCustomControl().
test.describe('Custom controls', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/');
    await waitForGeoman(page);
  });

  test('renders a custom control and fires its onClick handler', async () => {
    await page.evaluate(() => {
      window.customData = { rawEventResults: { clicks: 0 } };
      window.geoman.control.addCustomControl({
        id: 'unit-toggle',
        title: 'Toggle layer',
        onClick: () => {
          const data = window.customData.rawEventResults as { clicks: number };
          data.clicks += 1;
        },
      });
    });

    const button = page.locator('#id_custom_unit-toggle');
    await expect(button).toBeVisible();
    // no icon provided -> first two chars of the title are the text fallback
    await expect(button).toHaveText('To');
    await expect(button).toHaveAttribute('title', 'Toggle layer');

    await button.click();
    await button.click();

    const clicks = await page.evaluate(
      () => (window.customData.rawEventResults as { clicks: number }).clicks,
    );
    expect(clicks).toBe(2);
  });

  test('passes the geoman instance and control to the handler', async () => {
    await page.evaluate(() => {
      window.customData = {};
      window.geoman.control.addCustomControl({
        id: 'unit-context',
        title: 'Ctx',
        onClick: ({ gm, control }) => {
          window.customData.rawEventResults = {
            hasGm: gm === window.geoman,
            controlId: control.id,
          };
        },
      });
    });

    // auto-waits for the Svelte store update to render the button before clicking
    await page.locator('#id_custom_unit-context').click();

    const result = await page.evaluate(() => window.customData.rawEventResults);
    expect(result).toEqual({ hasGm: true, controlId: 'unit-context' });
  });

  test('renders the icon when provided and sorts by order', async () => {
    await page.evaluate(() => {
      window.geoman.control.addCustomControl({
        id: 'second',
        title: 'Second',
        order: 20,
        onClick: () => {},
      });
      window.geoman.control.addCustomControl({
        id: 'first',
        title: 'First',
        order: 10,
        icon: '<svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg>',
        onClick: () => {},
      });
    });

    const group = page.locator('.group-custom');
    await expect(group).toBeVisible();
    // lower `order` comes first regardless of insertion order
    const ids = await group.locator('button').evaluateAll((els) => els.map((el) => el.id));
    expect(ids).toEqual(['id_custom_first', 'id_custom_second']);

    // icon control renders the (sanitized) svg rather than a text fallback
    await expect(page.locator('#id_custom_first svg')).toBeVisible();
  });

  test('removeCustomControl removes the button', async () => {
    await page.evaluate(() => {
      window.geoman.control.addCustomControl({ id: 'removable', title: 'Rm', onClick: () => {} });
    });
    await expect(page.locator('#id_custom_removable')).toBeVisible();

    await page.evaluate(() => {
      window.geoman.control.removeCustomControl('removable');
    });
    await expect(page.locator('#id_custom_removable')).toHaveCount(0);
  });

  test('adding a control with an existing id replaces it', async () => {
    await page.evaluate(() => {
      window.geoman.control.addCustomControl({ id: 'dup', title: 'Old', onClick: () => {} });
      window.geoman.control.addCustomControl({ id: 'dup', title: 'New', onClick: () => {} });
    });

    await expect(page.locator('#id_custom_dup')).toHaveCount(1);
    await expect(page.locator('#id_custom_dup')).toHaveAttribute('title', 'New');
  });

  test('renders controls passed declaratively at init and keeps the handler through the options merge', async () => {
    // Reinit Geoman with `customControls` in the init options. This exercises the
    // declarative path: the handler must survive the options deep-merge (it is
    // held by reference outside the merge) for the click below to register.
    await page.evaluate(async () => {
      await window.geoman.destroy({ removeSources: true });
      window.customData = { rawEventResults: { clicks: 0 } };
      const geoman = new window.GeomanClass(window.mapInstance, {
        customControls: [
          {
            id: 'init-decl',
            title: 'Declared',
            icon: '<svg viewBox="0 0 10 10"><rect width="10" height="10" /></svg>',
            onClick: () => {
              const data = window.customData.rawEventResults as { clicks: number };
              data.clicks += 1;
            },
          },
        ],
      });
      window.geoman = geoman;
    });

    await waitForGeoman(page);

    const button = page.locator('#id_custom_init-decl');
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute('title', 'Declared');
    // icon renders -> the declarative control reached the component intact
    await expect(page.locator('#id_custom_init-decl svg')).toBeVisible();

    // clicking proves the onClick function was not stripped by the deep-merge
    await button.click();
    const clicks = await page.evaluate(
      () => (window.customData.rawEventResults as { clicks: number }).clicks,
    );
    expect(clicks).toBe(1);
  });

  test('keeps insertion order for controls without an explicit order', async () => {
    await page.evaluate(() => {
      window.geoman.control.addCustomControl({ id: 'alpha', title: 'A', onClick: () => {} });
      window.geoman.control.addCustomControl({ id: 'beta', title: 'B', onClick: () => {} });
      window.geoman.control.addCustomControl({ id: 'gamma', title: 'C', onClick: () => {} });
    });

    const ids = await page
      .locator('.group-custom button')
      .evaluateAll((els) => els.map((el) => el.id));
    expect(ids).toEqual(['id_custom_alpha', 'id_custom_beta', 'id_custom_gamma']);
  });
});
