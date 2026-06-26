import { testServerUrl } from './server-config.ts';

// Strict health check: confirm the configured test-server URL is actually
// serving the Geoman dev app before any test runs. Playwright's webServer reuse
// only checks that *something* answers on the port, so a foreign dev server
// (e.g. another project on the same port) would otherwise be reused silently and
// every test would fail with a confusing "Geoman failed to initialize".
export default async function globalSetup(): Promise<void> {
  let body: string;
  try {
    const response = await fetch(testServerUrl);
    body = await response.text();
  } catch (error) {
    throw new Error(
      `Test server health check failed: could not reach ${testServerUrl} (${String(error)}).`,
    );
  }

  // Markers rendered by the Geoman dev app entry HTML (apps/dev + index.html).
  const isGeomanApp = body.includes('id="dev-map"') && body.includes('Geoman plugin');
  if (!isGeomanApp) {
    throw new Error(
      `Test server health check failed: ${testServerUrl} did not serve the Geoman dev app — ` +
        `another process is likely using the port. Free it, or set PLAYWRIGHT_TEST_PORT ` +
        `to an unused port (e.g. PLAYWRIGHT_TEST_PORT=4100).`,
    );
  }
}
