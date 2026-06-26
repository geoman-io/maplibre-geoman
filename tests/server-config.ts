// Single source of truth for the Playwright test-server location, shared by
// playwright.config.ts and the globalSetup health check so they can never drift.
// The port is configurable via PLAYWRIGHT_TEST_PORT, defaulting per variant so
// the maplibre and mapbox runs don't collide.
const variant = process.env.PLAYWRIGHT_VARIANT === 'mapbox' ? 'mapbox' : 'maplibre';

export const testServerHost = '127.0.0.1';

const defaultPort = variant === 'mapbox' ? 4001 : 4000;
const parsedPort = Number.parseInt(process.env.PLAYWRIGHT_TEST_PORT ?? '', 10);
export const testServerPort =
  Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : defaultPort;

export const testServerUrl = `http://${testServerHost}:${testServerPort}/`;
