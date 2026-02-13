import test, { expect, type Page } from '@playwright/test';

test.describe('Lifecycle - waitForBaseMap reliability', () => {
  test.describe.configure({ mode: 'serial' });

  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/');
    await page.waitForFunction(() => !!window.mapInstance && !!window.GeomanClass);
  });

  test('initializes when visibility changes from hidden to visible', async () => {
    const result = await page.evaluate(async () => {
      const map = window.mapInstance as unknown as Record<string, unknown>;
      window.geoman?.destroy();

      const originalLoaded = map.loaded as (() => boolean) | undefined;
      const originalIsStyleLoaded = map.isStyleLoaded as (() => boolean) | undefined;
      const originalPrivateLoaded = map._loaded as boolean | undefined;
      const originalVisibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState');

      let styleLoaded = false;
      let visibilityState: DocumentVisibilityState = 'hidden';

      map.loaded = () => false;
      map.isStyleLoaded = () => styleLoaded;
      map._loaded = false;

      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get() {
          return visibilityState;
        },
      });

      try {
        const geoman = new window.GeomanClass(window.mapInstance, {});

        styleLoaded = true;
        visibilityState = 'visible';
        document.dispatchEvent(new Event('visibilitychange'));

        await geoman.waitForBaseMap();
        return {
          resolved: true,
          destroyed: geoman.destroyed,
        };
      } finally {
        if (originalLoaded) {
          map.loaded = originalLoaded;
        }
        if (originalIsStyleLoaded) {
          map.isStyleLoaded = originalIsStyleLoaded;
        } else {
          delete map.isStyleLoaded;
        }
        if (typeof originalPrivateLoaded === 'boolean') {
          map._loaded = originalPrivateLoaded;
        } else {
          delete map._loaded;
        }
        if (originalVisibilityState) {
          Object.defineProperty(document, 'visibilityState', originalVisibilityState);
        }
      }
    });

    expect(result.resolved).toBe(true);
    expect(result.destroyed).toBe(false);
  });

  test('destroy-before-load aborts pending wait without delayed init error', async () => {
    const result = await page.evaluate(async () => {
      const map = window.mapInstance as unknown as Record<string, unknown>;
      window.geoman?.destroy();

      const originalLoaded = map.loaded as (() => boolean) | undefined;
      const originalIsStyleLoaded = map.isStyleLoaded as (() => boolean) | undefined;
      const originalPrivateLoaded = map._loaded as boolean | undefined;
      const originalConsoleError = console.error;
      const capturedErrors: string[] = [];

      map.loaded = () => false;
      map.isStyleLoaded = () => false;
      map._loaded = false;
      console.error = (...args: unknown[]) => {
        capturedErrors.push(args.map((arg) => String(arg)).join(' '));
        originalConsoleError(...args);
      };

      try {
        const geoman = new window.GeomanClass(window.mapInstance, {});
        await geoman.destroy();
        await new Promise((resolve) => setTimeout(resolve, 50));

        return {
          destroyed: geoman.destroyed,
          hasPendingCleanup: Boolean(geoman._pendingBaseMapCleanup),
          hasPendingAbort: Boolean(geoman._pendingBaseMapAbort),
          hasInitFailureError: capturedErrors.some((line) =>
            line.includes('Geoman initialization failed'),
          ),
        };
      } finally {
        console.error = originalConsoleError;
        if (originalLoaded) {
          map.loaded = originalLoaded;
        }
        if (originalIsStyleLoaded) {
          map.isStyleLoaded = originalIsStyleLoaded;
        } else {
          delete map.isStyleLoaded;
        }
        if (typeof originalPrivateLoaded === 'boolean') {
          map._loaded = originalPrivateLoaded;
        } else {
          delete map._loaded;
        }
      }
    });

    expect(result.destroyed).toBe(true);
    expect(result.hasPendingCleanup).toBe(false);
    expect(result.hasPendingAbort).toBe(false);
    expect(result.hasInitFailureError).toBe(false);
  });

  test('timeout path cleans listeners and interval resources', async () => {
    const result = await page.evaluate(async () => {
      const map = window.mapInstance as unknown as Record<string, unknown>;
      window.geoman?.destroy();

      const originalLoaded = map.loaded as (() => boolean) | undefined;
      const originalIsStyleLoaded = map.isStyleLoaded as (() => boolean) | undefined;
      const originalPrivateLoaded = map._loaded as boolean | undefined;
      const originalOff = map.off as ((type: string, listener: unknown) => unknown) | undefined;
      const originalSetTimeout = window.setTimeout.bind(window);
      const originalSetInterval = window.setInterval.bind(window);
      const originalClearInterval = window.clearInterval.bind(window);

      let loadOffCalls = 0;
      let clearIntervalCalls = 0;

      map.loaded = () => false;
      map.isStyleLoaded = () => false;
      map._loaded = false;
      map.off = (type: string, listener: unknown) => {
        if (type === 'load') {
          loadOffCalls += 1;
        }
        if (originalOff) {
          return originalOff(type, listener);
        }
      };

      window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
        // Force the 60s initialization timeout to trigger quickly in tests.
        const effectiveTimeout = timeout === 60000 ? 10 : timeout;
        return originalSetTimeout(handler, effectiveTimeout, ...args);
      }) as typeof window.setTimeout;

      window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
        return originalSetInterval(handler, timeout, ...args);
      }) as typeof window.setInterval;

      window.clearInterval = ((id?: number) => {
        clearIntervalCalls += 1;
        return originalClearInterval(id);
      }) as typeof window.clearInterval;

      try {
        const geoman = new window.GeomanClass(window.mapInstance, {});
        let timeoutMessage = '';
        try {
          await geoman.waitForBaseMap();
        } catch (error) {
          timeoutMessage = error instanceof Error ? error.message : String(error);
        }
        await new Promise((resolve) => setTimeout(resolve, 20));

        return {
          timeoutMessage,
          loadOffCalls,
          clearIntervalCalls,
        };
      } finally {
        window.setTimeout = originalSetTimeout;
        window.setInterval = originalSetInterval;
        window.clearInterval = originalClearInterval;
        if (originalOff) {
          map.off = originalOff;
        } else {
          delete map.off;
        }
        if (originalLoaded) {
          map.loaded = originalLoaded;
        }
        if (originalIsStyleLoaded) {
          map.isStyleLoaded = originalIsStyleLoaded;
        } else {
          delete map.isStyleLoaded;
        }
        if (typeof originalPrivateLoaded === 'boolean') {
          map._loaded = originalPrivateLoaded;
        } else {
          delete map._loaded;
        }
      }
    });

    expect(result.timeoutMessage).toContain('waitForBaseMap failed');
    expect(result.loadOffCalls).toBeGreaterThan(0);
    expect(result.clearIntervalCalls).toBeGreaterThan(0);
  });
});
