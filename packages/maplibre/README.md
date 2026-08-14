<p align="center">
  <a href="https://geoman.io">
    <img width="130" alt="Geoman Logo" src="https://geoman-static.onrender.com/assets/logo_white_bg.svg" />
  </a>
</p>
<h1 align="center">
  Maplibre-Geoman
</h1>
<p align="center">
  <strong>MapLibre Plugin For Creating And Editing Geometry Layers</strong><br>
  Draw, Edit, Drag, Cut, Rotate, Split, Scale, Measure, Snap and Pin Layers<br>
  Supports Markers, CircleMarkers, Polylines, Polygons, Circles, Rectangles, ImageOverlays, LayerGroups, GeoJSON, MultiLineStrings and MultiPolygons
</p>
<p align="center">
  <a href="https://badge.fury.io/js/%40geoman-io%2Fmaplibre-geoman-free">
    <img src="https://badge.fury.io/js/%40geoman-io%2Fmaplibre-geoman-free.svg" alt="npm version" height="18">
  </a>
  <a href="https://www.npmjs.com/package/@geoman-io/maplibre-geoman-free">
    <img src="https://img.shields.io/npm/dt/@geoman-io/maplibre-geoman-free.svg" alt="NPM Downloads" />
  </a>
</p>

<p align="center">
    <img src="https://github.com/geoman-io/maplibre-geoman/raw/master/geoman-maplibre-demo.png" alt="Demo" />
</p>

## Installation

```shell
npm install @geoman-io/maplibre-geoman-free
```

## Requirements

This package requires **MapLibre GL JS v6** (`maplibre-gl >=6.0.0 <7.0.0`) and is **ESM-only**,
following MapLibre v6 itself. There is no UMD build and no `require` entry point.

MapLibre v6 no longer resolves its own web worker once the library is bundled, so **your app must
point it at one before creating a map** — this is a MapLibre requirement, not a Geoman one, and a
map created without it fails at runtime. How you get the URL depends on your bundler; see
[MapLibre's bundler guide](https://maplibre.org/maplibre-gl-js/docs/guides/bundlers/).

```typescript
// Vite
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
ml.setWorkerUrl(workerUrl);

// Webpack 5 / Rspack (or any bundler supporting `new URL(..., import.meta.url)`)
ml.setWorkerUrl(new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).href);

// No bundler — serve the file yourself and pass its path
ml.setWorkerUrl('/vendor/maplibre-gl-worker.mjs');
```

## Usage

```typescript
import * as ml from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { Geoman, type GmOptionsPartial } from '@geoman-io/maplibre-geoman-free';

import 'maplibre-gl/dist/maplibre-gl.css';
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';

// See "Requirements" above — must run before the first `new ml.Map()`.
ml.setWorkerUrl(workerUrl);

const map = new ml.Map({
  container: 'dev-map',
  style: {
    version: 8,
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
      },
    },
    layers: [
      {
        id: 'osm-tiles-layer',
        type: 'raster',
        source: 'osm-tiles',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
  center: [0, 51],
  zoom: 5,
});

const geoman = new Geoman(map);

map.on('gm:loaded', () => {
  console.log('Geoman fully loaded');
});
```

## Documentation

Visit [geoman.io/docs/maplibre](https://www.geoman.io/docs/maplibre) to get started.

## Demo

Check out the full power of Maplibre-Geoman Pro on [geoman.io/demo/maplibre](https://geoman.io/demo/maplibre)

## Links

- [GitHub Repository](https://github.com/geoman-io/maplibre-geoman)
- [Report Issues](https://github.com/geoman-io/maplibre-geoman/issues)
- [Pro Version & Pricing](https://geoman.io/pricing)

## License

MIT
