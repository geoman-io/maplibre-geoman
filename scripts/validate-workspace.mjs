#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));

const rootPkg = readJson('package.json');
const corePkg = readJson('packages/core/package.json');
const maplibrePkg = readJson('packages/maplibre/package.json');
const mapboxPkg = readJson('packages/mapbox/package.json');

const fail = (message) => {
  console.error(`Workspace validation failed: ${message}`);
  process.exit(1);
};

const expectedVersion = rootPkg.version;
for (const [name, version] of [
  ['core', corePkg.version],
  ['maplibre', maplibrePkg.version],
  ['mapbox', mapboxPkg.version],
]) {
  if (version !== expectedVersion) {
    fail(`Version mismatch (${name}=${version}, root=${expectedVersion})`);
  }
}

const hasPeer = (pkg, name) => Boolean(pkg.peerDependencies && pkg.peerDependencies[name]);
const hasDependency = (pkg, name) => Boolean(pkg.dependencies && pkg.dependencies[name]);

if (!hasPeer(maplibrePkg, 'maplibre-gl') || hasPeer(maplibrePkg, 'mapbox-gl')) {
  fail('MapLibre package peerDependencies must include maplibre-gl and exclude mapbox-gl');
}

if (!hasPeer(mapboxPkg, 'mapbox-gl') || hasPeer(mapboxPkg, 'maplibre-gl')) {
  fail('Mapbox package peerDependencies must include mapbox-gl and exclude maplibre-gl');
}

for (const workspaceName of ['apps/dev', 'packages/core', 'packages/maplibre', 'packages/mapbox']) {
  if (!rootPkg.workspaces.includes(workspaceName)) {
    fail(`Root package workspaces must include "${workspaceName}"`);
  }
}

const maplibreDependencies = maplibrePkg.dependencies ?? {};
const mapboxDependencies = mapboxPkg.dependencies ?? {};
const dependencyNames = new Set([...Object.keys(maplibreDependencies), ...Object.keys(mapboxDependencies)]);

for (const dependencyName of dependencyNames) {
  const maplibreVersion = maplibreDependencies[dependencyName];
  const mapboxVersion = mapboxDependencies[dependencyName];

  if (!maplibreVersion || !mapboxVersion) {
    fail(`Dependency "${dependencyName}" must be present in both maplibre and mapbox package.json files`);
  }

  if (maplibreVersion !== mapboxVersion) {
    fail(
      `Dependency "${dependencyName}" version mismatch (maplibre=${maplibreVersion}, mapbox=${mapboxVersion})`
    );
  }
}

for (const [label, pkg, variant] of [
  ['maplibre', maplibrePkg, 'maplibre'],
  ['mapbox', mapboxPkg, 'mapbox'],
]) {
  if (!pkg.exports || !pkg.exports['.']) {
    fail(`${label} package must define a root "." export`);
  }
  const buildScript = pkg.scripts?.build ?? '';
  if (!buildScript.includes(`verify-variant-bundle.mjs ${variant}`)) {
    fail(`${label} package build script must run verify-variant-bundle.mjs`);
  }
}

const listFiles = (dir) => {
  const files = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        visit(full);
      } else if (entry.isFile() && /\.(ts|css)$/.test(entry.name)) {
        files.push(full);
      }
    }
  };
  visit(path.join(rootDir, dir));
  return files;
};

const checkNoCrossImports = ({ fromDir, forbiddenPatterns, label }) => {
  for (const file of listFiles(fromDir)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(content)) {
        const relative = path.relative(rootDir, file);
        fail(`${label} cross-import detected in ${relative} (${pattern})`);
      }
    }
  }
};

checkNoCrossImports({
  fromDir: 'packages/maplibre/src',
  forbiddenPatterns: [
    /from\s+['"][^'"]*mapbox[^'"]*['"]/,
    /import\s+['"][^'"]*mapbox[^'"]*['"]/,
    /packages\/mapbox\/src\/adapter/,
  ],
  label: 'maplibre',
});

checkNoCrossImports({
  fromDir: 'packages/mapbox/src',
  forbiddenPatterns: [
    /from\s+['"][^'"]*maplibre[^'"]*['"]/,
    /import\s+['"][^'"]*maplibre[^'"]*['"]/,
    /packages\/maplibre\/src\/adapter/,
  ],
  label: 'mapbox',
});

console.log('Workspace validation passed');
