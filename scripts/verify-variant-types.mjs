#!/usr/bin/env node

import fs from 'node:fs';

const [variant, filePath] = process.argv.slice(2);

if (!variant || !filePath) {
  console.error('Usage: node scripts/verify-variant-types.mjs <maplibre|mapbox> <path>');
  process.exit(1);
}

if (!['maplibre', 'mapbox'].includes(variant)) {
  console.error(`Unsupported variant "${variant}". Expected "maplibre" or "mapbox".`);
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`Missing type bundle: ${filePath}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

const checks =
  variant === 'maplibre'
    ? [
        { ok: content.includes("from 'maplibre-gl'"), message: 'Expected maplibre-gl types' },
        {
          ok: !content.includes("from 'mapbox-gl'"),
          message: 'Did not expect mapbox-gl types in maplibre bundle',
        },
      ]
    : [
        { ok: content.includes("from 'mapbox-gl'"), message: 'Expected mapbox-gl types' },
        {
          ok: !content.includes("from 'maplibre-gl'"),
          message: 'Did not expect maplibre-gl types in mapbox bundle',
        },
      ];

const failed = checks.filter((check) => !check.ok);
if (failed.length > 0) {
  for (const check of failed) {
    console.error(`Type verification failed: ${check.message}`);
  }
  process.exit(1);
}

console.log(`Type verification passed for ${variant}: ${filePath}`);
