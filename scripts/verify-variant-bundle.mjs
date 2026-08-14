#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const [variant, distDirArg] = process.argv.slice(2);
const distDir = distDirArg ?? 'dist';

if (!variant || !['maplibre', 'mapbox'].includes(variant)) {
  console.error('Usage: node scripts/verify-variant-bundle.mjs <maplibre|mapbox> [distDir]');
  process.exit(1);
}

const expected = variant === 'maplibre' ? 'maplibre-gl' : 'mapbox-gl';
const forbidden = variant === 'maplibre' ? 'mapbox-gl' : 'maplibre-gl';

// Bundle formats published per variant. maplibre-gl v6 is ESM-only, so the maplibre package
// ships no UMD build. Keep in sync with `variantBuildFormats` in
// packages/core/build/createVariantViteConfig.ts.
const variantBundleFormats = {
  maplibre: ['es'],
  mapbox: ['es', 'umd'],
};

const bundlePaths = variantBundleFormats[variant].map((format) =>
  path.join(distDir, `${variant}-geoman.${format}.js`),
);

for (const file of bundlePaths) {
  if (!fs.existsSync(file)) {
    console.error(`Missing bundle file: ${file}`);
    process.exit(1);
  }
}

const unexpected = variantBundleFormats[variant].includes('umd')
  ? []
  : [path.join(distDir, `${variant}-geoman.umd.js`)].filter((file) => fs.existsSync(file));

for (const file of unexpected) {
  console.error(`Unexpected bundle file for ${variant}: ${file}`);
  process.exit(1);
}

const checks = bundlePaths.flatMap((file) => {
  const content = fs.readFileSync(file, 'utf8');
  return [
    {
      ok: content.includes(expected),
      message: `${path.basename(file)} is missing expected dependency "${expected}"`,
    },
    {
      ok: !content.includes(forbidden),
      message: `${path.basename(file)} unexpectedly references "${forbidden}"`,
    },
    {
      ok: !content.includes('@mapLib/'),
      message: `${path.basename(file)} still contains unresolved @mapLib alias`,
    },
  ];
});

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
  for (const check of failed) {
    console.error(`Bundle verification failed: ${check.message}`);
  }
  process.exit(1);
}

console.log(`Bundle verification passed for ${variant}: ${distDir}`);
