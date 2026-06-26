<p align="center">
  <a href="https://geoman.io">
    <img width="130" alt="Geoman Logo" src="https://geoman-static.onrender.com/assets/logo_white_bg.svg" />
  </a>
</p>
<h1 align="center">
  Maplibre-Geoman
</h1>
<p align="center">
  <strong>Maplibre Plugin For Creating And Editing Geometry Layers</strong><br>
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

## Documentation

Visit [geoman.io/docs/maplibre](https://www.geoman.io/docs/maplibre) to get started.
For contributor-focused internals, see [ARCHITECTURE.md](ARCHITECTURE.md).

Adding your own buttons to the control bar is documented in
[docs/custom-controls.md](docs/custom-controls.md).

## Issues

If you have support questions or want to report issues, please [create an issue](https://github.com/geoman-io/maplibre-geoman/issues) in this repository. Use this repository for issues related to both the free and pro versions of Maplibre-Geoman.

## Demo

Check out the full power of Maplibre-Geoman Pro on [geoman.io/demo/maplibre](https://geoman.io/demo/maplibre)

Or watch a demo video on [YouTube](https://youtu.be/VX7A_rb2Pis)

## Installation

### Free Version

```shell
# install maplibre free version
npm install @geoman-io/maplibre-geoman-free

# install mapbox free version
npm install @geoman-io/mapbox-geoman-free
```

### Pro Version

Add the following content to .npmrc in your project root

```shell
#.npmrc
@geoman-io:registry=https://npm.geoman.io/
//npm.geoman.io/:_authToken="<YOUR LICENSE KEY>"
```

Replace `<YOUR LICENSE KEY>` with your license key.

```shell
# install pro version
npm install @geoman-io/maplibre-geoman-pro
```

Don't have a license key yet? [Purchase one here](https://geoman.io/pricing).

## Usage

### Examples

| Framework/Template     | Demo URL                                          | Code URL                                                                                         | Description                                                     |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| maplibre-geoman-vite   | [Demo](https://maplibre-geoman-vite.vercel.app)   | [Code](https://github.com/geoman-io/maplibre-geoman-examples/tree/master/maplibre-geoman-vite)   | Vanilla JavaScript implementation using Vite as the build tool  |
| maplibre-geoman-vue    | [Demo](https://maplibre-geoman-vue.vercel.app)    | [Code](https://github.com/geoman-io/maplibre-geoman-examples/tree/master/maplibre-geoman-vue)    | Vue.js integration showcasing reactive map editing capabilities |
| maplibre-geoman-react  | [Demo](https://maplibre-geoman-react.vercel.app)  | [Code](https://github.com/geoman-io/maplibre-geoman-examples/tree/master/maplibre-geoman-react)  | React implementation with hooks and components for map editing  |
| maplibre-geoman-preact | [Demo](https://maplibre-geoman-preact.vercel.app) | [Code](https://github.com/geoman-io/maplibre-geoman-examples/tree/master/maplibre-geoman-preact) | Lightweight Preact alternative to the React implementation      |
| maplibre-geoman-nextjs | [Demo](https://maplibre-geoman-nextjs.vercel.app) | [Code](https://github.com/geoman-io/maplibre-geoman-examples/tree/master/maplibre-geoman-nextjs) | Next.js integration with server-side rendering support          |
| maplibre-geoman-svelte | [Demo](https://maplibre-geoman-svelte.vercel.app) | [Code](https://github.com/geoman-io/maplibre-geoman-examples/tree/master/maplibre-geoman-svelte) | Svelte implementation offering reactive map editing features    |

### Expected HTML Structure

```html
<!-- index.html -->
<html lang="en_US">
  <head>
    <title>Geoman Maplibre</title>
    <style>
      #dev-map {
        height: 100vh;
        width: 100vw;
      }
    </style>
  </head>
  <body>
    <div id="dev-map"></div>
  </body>
</html>
```

### Maplibre and Geoman initialization

```typescript
import ml from "maplibre-gl";
import { Geoman, type GmOptionsPartial } from "@geoman-io/maplibre-geoman-free";

import "maplibre-gl/dist/maplibre-gl.css";
import "@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css";

const mapStyle: ml.StyleSpecification = {
  version: 8,
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const map = new ml.Map({
  container: "dev-map",
  style: mapStyle,
  center: [0, 51],
  zoom: 5,
});

const gmOptions: GmOptionsPartial = {
  // geoman options here
};

const geoman = new Geoman(map, gmOptions);

map.on("gm:loaded", () => {
  console.log("Geoman fully loaded");

  // Here you can add your geojson shapes for example
  const shapeGeoJson = {
    type: "Feature",
    geometry: { type: "Point", coordinates: [0, 51] },
  };
  map.gm.features.addGeoJsonFeature({ shapeGeoJson });
});
```

### Mapbox and Geoman initialization

```typescript
import mapboxgl from "mapbox-gl";
import { Geoman, type GmOptionsPartial } from "@geoman-io/mapbox-geoman-free";

import "mapbox-gl/dist/mapbox-gl.css";
import "@geoman-io/mapbox-geoman-free/dist/mapbox-geoman.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? "";

const mapStyle: mapboxgl.StyleSpecification = {
  version: 8,
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm-tiles-layer",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

const map = new mapboxgl.Map({
  container: "dev-map",
  style: mapStyle,
  center: [0, 51],
  zoom: 5,
});

const gmOptions: GmOptionsPartial = {
  // geoman options here
};

const geoman = new Geoman(map, gmOptions);
await geoman.waitForGeomanLoaded();
```

### Custom controls

Add your own buttons to the control bar with a custom icon, tooltip and click
handler. Each runs its own `onClick` instead of toggling a built-in mode — handy
for toggling a map layer, exporting data, or any host-specific action.

```ts
const geoman = new Geoman(map, {
  customControls: [
    {
      id: 'toggle-parcels', // unique; also used for the button id/class and removal
      title: 'Toggle parcels layer', // tooltip (first 2 chars are the text fallback)
      icon: '<svg viewBox="0 0 20 20">...</svg>', // optional SVG, sanitized before render
      order: 10, // optional sort order within the custom group
      onClick: ({ gm, control, event }) => {
        const visible = map.getLayoutProperty('parcels', 'visibility') !== 'none';
        map.setLayoutProperty('parcels', 'visibility', visible ? 'none' : 'visible');
      },
    },
  ],
});
```

You can also add or remove controls at run time:

```ts
geoman.control.addCustomControl({ id: 'export', title: 'Export', onClick: () => save() });
geoman.control.removeCustomControl('export');
```

See [docs/custom-controls.md](docs/custom-controls.md) for the full reference and
a live example in the dev app (`apps/dev/common.ts`).

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started, report issues, and submit pull requests.

## Local Development

```shell
# Install dependencies (this repo uses pnpm)
pnpm install --frozen-lockfile

# Run dev app with MapLibre adapter
pnpm run dev:maplibre

# Run dev app with Mapbox adapter
pnpm run dev:mapbox

# Run checks
pnpm run workspace:validate
pnpm run lint:all
pnpm run typecheck:all
pnpm run build:all

# Run smoke tests for each variant
pnpm run test:maplibre --project=chromium --grep="@smoke"
pnpm run test:mapbox --project=chromium --grep="@smoke"

# Run full test suite for both variants
pnpm run test:all
```

## Code of Conduct

We are committed to fostering a welcoming and respectful community. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Security Policy

If you discover a security vulnerability, please see our [Security Policy](SECURITY.md) for responsible disclosure guidelines.

## License & Commercial Use

This repository is licensed under the MIT License, which means you are free to use, modify, and distribute this software for any purpose, including commercial use. The free version of Maplibre-Geoman is fully open source. However, please note that the Pro version of Maplibre-Geoman is not open source and requires a commercial license, which can be purchased at [geoman.io/pricing](https://geoman.io/pricing). See [LICENSE](LICENSE) for full license details.
