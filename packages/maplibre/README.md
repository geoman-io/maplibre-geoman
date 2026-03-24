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

## Usage

```typescript
import ml from "maplibre-gl";
import { Geoman, type GmOptionsPartial } from "@geoman-io/maplibre-geoman-free";

import "maplibre-gl/dist/maplibre-gl.css";
import "@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css";

const map = new ml.Map({
  container: "dev-map",
  style: {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
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
  },
  center: [0, 51],
  zoom: 5,
});

const geoman = new Geoman(map);

map.on("gm:loaded", () => {
  console.log("Geoman fully loaded");
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
