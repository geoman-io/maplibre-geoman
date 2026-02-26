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

const lockPath = path.join(rootDir, 'package-lock.json');
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
lock.version = nextVersion;

if (lock.packages?.['']) {
  lock.packages[''].version = nextVersion;
}

for (const key of ['packages/core', 'packages/maplibre', 'packages/mapbox']) {
  if (lock.packages?.[key]) {
    lock.packages[key].version = nextVersion;
  }
}

fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);

console.log(`Updated workspace version to ${nextVersion}`);
