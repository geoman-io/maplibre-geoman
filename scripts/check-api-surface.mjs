#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const args = process.argv.slice(2);
const shouldWrite = args.includes('--write');

const variantArgIndex = args.findIndex((arg) => arg === '--variant');
const variantFilter = variantArgIndex >= 0 ? args[variantArgIndex + 1] : null;

const variants = [
  {
    name: 'maplibre',
    dtsPath: 'packages/maplibre/dist/maplibre-geoman.d.ts',
    baselinePath: 'scripts/api-surface/maplibre.json',
  },
  {
    name: 'mapbox',
    dtsPath: 'packages/mapbox/dist/mapbox-geoman.d.ts',
    baselinePath: 'scripts/api-surface/mapbox.json',
  },
].filter((variant) => !variantFilter || variant.name === variantFilter);

if (variants.length === 0) {
  console.error('Unknown --variant value. Expected maplibre or mapbox.');
  process.exit(1);
}

const readFile = (relativePath) => fs.readFileSync(path.join(rootDir, relativePath), 'utf8');

const extractExports = (content) => {
  const exported = new Set();
  const lines = content.split('\n');

  for (const line of lines) {
    const fn = line.match(/^export declare function\s+([A-Za-z0-9_]+)/);
    if (fn) exported.add(`function:${fn[1]}`);

    const cls = line.match(/^export declare class\s+([A-Za-z0-9_]+)/);
    if (cls) exported.add(`class:${cls[1]}`);

    const iface = line.match(/^export interface\s+([A-Za-z0-9_]+)/);
    if (iface) exported.add(`interface:${iface[1]}`);

    const typ = line.match(/^export type\s+([A-Za-z0-9_]+)/);
    if (typ) exported.add(`type:${typ[1]}`);

    const cnst = line.match(/^export declare const\s+([A-Za-z0-9_]+)/);
    if (cnst) exported.add(`const:${cnst[1]}`);

    const reexport = line.match(/^export \{([^}]+)\};?$/);
    if (reexport) {
      for (const raw of reexport[1].split(',')) {
        const value = raw.trim().replace(/\s+as\s+.*/, '');
        if (value) exported.add(`reexport:${value}`);
      }
    }
  }

  return Array.from(exported).sort();
};

for (const variant of variants) {
  const dtsAbsolute = path.join(rootDir, variant.dtsPath);
  if (!fs.existsSync(dtsAbsolute)) {
    console.error(`Missing d.ts for ${variant.name}: ${variant.dtsPath}`);
    process.exit(1);
  }

  const exportsList = extractExports(readFile(variant.dtsPath));
  const baselineAbsolute = path.join(rootDir, variant.baselinePath);

  if (shouldWrite || !fs.existsSync(baselineAbsolute)) {
    fs.mkdirSync(path.dirname(baselineAbsolute), { recursive: true });
    fs.writeFileSync(baselineAbsolute, `${JSON.stringify(exportsList, null, 2)}\n`);
    console.log(`Wrote API surface baseline: ${variant.baselinePath}`);
    continue;
  }

  const baseline = JSON.parse(fs.readFileSync(baselineAbsolute, 'utf8'));
  const added = exportsList.filter((entry) => !baseline.includes(entry));
  const removed = baseline.filter((entry) => !exportsList.includes(entry));

  if (added.length > 0 || removed.length > 0) {
    console.error(`API surface mismatch for ${variant.name}`);
    if (added.length > 0) {
      console.error(`Added exports (${added.length}):`);
      for (const value of added) console.error(`  + ${value}`);
    }
    if (removed.length > 0) {
      console.error(`Removed exports (${removed.length}):`);
      for (const value of removed) console.error(`  - ${value}`);
    }
    process.exit(1);
  }
}

console.log('API surface validation passed');
