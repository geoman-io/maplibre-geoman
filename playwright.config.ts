import { defineConfig, devices } from '@playwright/test';
import { testServerHost, testServerPort, testServerUrl } from './tests/server-config.ts';

const playwrightVariantRaw = process.env.PLAYWRIGHT_VARIANT;
if (!playwrightVariantRaw || !['maplibre', 'mapbox'].includes(playwrightVariantRaw)) {
  throw new Error(
    'PLAYWRIGHT_VARIANT must be explicitly set to "maplibre" or "mapbox" (use npm run test:maplibre or npm run test:mapbox).',
  );
}

const playwrightVariant = playwrightVariantRaw as 'maplibre' | 'mapbox';
const variantPackage =
  playwrightVariant === 'mapbox' ? 'mapbox-geoman-free' : 'maplibre-geoman-free';

// Port/host/url come from tests/server-config.ts (shared with the globalSetup
// health check). Launch the variant's Vite test server on that port.
// `--strictPort` makes Vite fail loudly if the port is already taken instead of
// drifting to another port (which would no longer match `testServerUrl`).
const testServerCommand =
  `pnpm --filter @geoman-io/${variantPackage} exec vite ../.. --config vite.config.ts ` +
  `--host ${testServerHost} --port ${testServerPort} --strictPort --mode test`;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Verify the test server is actually the Geoman dev app before running (guards
   * against a foreign process being reused on the port). */
  globalSetup: './tests/global-setup.ts',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Timeout for a test - increased for CI */
  timeout: 120000,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Run tests in parallel on CI (large runner) and locally */
  workers: process.env.CI ? 4 : 10,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }], // never launch a browser to show the report
    ['list'],                    // you can still keep the console‐list reporter
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: testServerUrl,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Navigation timeout - increased for CI */
    navigationTimeout: process.env.CI ? 60000 : 30000,
    /* Action timeout - increased for CI */
    actionTimeout: process.env.CI ? 30000 : 20000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // On CI, run against the system-installed Chrome stable (preinstalled on
        // GitHub runner images) instead of downloading a Playwright-managed
        // Chromium, which is blocked by unreliable runner egress for large
        // downloads. Local runs keep the pinned Playwright-managed browser.
        channel: process.env.CI ? 'chrome' : undefined,
        headless: true,
        launchOptions: {
          args: [
            // Force software WebGL so map rendering works in headless/sandboxed environments.
            '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader',
            '--ignore-gpu-blocklist',
            ...(process.env.CI
              ? [
                  '--no-sandbox',
                  '--disable-setuid-sandbox',
                  '--disable-dev-shm-usage',
                  '--disable-web-security',
                  '--disable-features=VizDisplayCompositor',
                ]
              : []),
          ],
        },
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run the local dev server before starting the tests. Locally an existing
   * server on the port is reused for speed; globalSetup then verifies it is
   * actually the Geoman app, so a foreign server fails fast with a clear error
   * instead of every test failing with "Geoman failed to initialize". */
  webServer: {
    command: testServerCommand,
    url: testServerUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
