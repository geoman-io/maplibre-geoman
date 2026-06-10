#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const nextVersion = process.argv[2];

if (!nextVersion || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(nextVersion)) {
  console.error('Usage: node scripts/bump-version.mjs <semver>');
  process.exit(1);
}

const rootDir = process.cwd();

const jsonFiles = [
  'package.json',
  'packages/core/package.json',
  'packages/maplibre/package.json',
  'packages/mapbox/package.json',
];

for (const relativeFile of jsonFiles) {
  const fullPath = path.join(rootDir, relativeFile);
  const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  content.version = nextVersion;
  fs.writeFileSync(fullPath, `${JSON.stringify(content, null, 2)}\n`);
}

// pnpm-lock.yaml does not embed workspace package versions, so no lockfile edit is needed.

console.log(`Updated workspace version to ${nextVersion}`);
