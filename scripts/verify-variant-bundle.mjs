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

const esBundlePath = path.join(distDir, `${variant}-geoman.es.js`);
const umdBundlePath = path.join(distDir, `${variant}-geoman.umd.js`);

for (const file of [esBundlePath, umdBundlePath]) {
  if (!fs.existsSync(file)) {
    console.error(`Missing bundle file: ${file}`);
    process.exit(1);
  }
}

const checks = [esBundlePath, umdBundlePath].flatMap((file) => {
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
