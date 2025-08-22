import log from "loglevel";
import "maplibre-gl/dist/maplibre-gl.css";

import "@/dev/styles/style.css";
import "@/styles/map/maplibre.css";

import mapLibreStyle from "@/dev/maplibre-style.ts";

import ml from "maplibre-gl";
import { FEATURE_ID_PROPERTY, Geoman } from "@/main.ts";
import type {
  GeoJsonImportFeature,
  GeoJsonImportFeatureCollection,
  GmOptionsPartial,
  LngLat,
} from "@/main.ts";

log.setLevel(log.levels.TRACE);

const existingMapInstance = window.customData?.map as ml.Map | undefined;

const map =
  existingMapInstance ||
  new ml.Map({
    container: "dev-map",
    style: mapLibreStyle,
    center: [0, 51],
    zoom: 5,
    fadeDuration: 50,
  });

let geoman: Geoman | null = null;

const loadStressTestFeatureCollection = (
  step: number,
  size: number,
  geometry: "rectangle" | "circle"
) => {
  const geoJson: GeoJsonImportFeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  const createCircleFeature = (coords: Array<LngLat>): GeoJsonImportFeature => {
    const [minLng, minLat] = coords.reduce(
      ([minLng, minLat], [lng, lat]) => [
        Math.min(minLng, lng),
        Math.min(minLat, lat),
      ],
      [Infinity, Infinity]
    );

    const [maxLng, maxLat] = coords.reduce(
      ([maxLng, maxLat], [lng, lat]) => [
        Math.max(maxLng, lng),
        Math.max(maxLat, lat),
      ],
      [-Infinity, -Infinity]
    );

    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;

    const radiusLng = (maxLng - minLng) / 2;
    const radiusLat = (maxLat - minLat) / 2;

    const points = [];

    for (let i = 0; i < 20; i++) {
      const angle = (2 * Math.PI * i) / 20;
      const lng = centerLng + radiusLng * Math.cos(angle);
      const lat = centerLat + radiusLat * Math.sin(angle);
      points.push([lng, lat]);
    }

    points.push(points[0]);

    const featureId = `${coords[0][0]}-${coords[0][1]}-complex`;

    return {
      id: featureId,
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [points],
      },
      properties: {
        shape: "polygon",
      },
    };
  };

  const createPolygonFeature = (
    coords: Array<LngLat>
  ): GeoJsonImportFeature => {
    const featureId = `${coords[0][0]}-${coords[0][1]}`;
    return {
      id: featureId,
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coords],
      },
      properties: {
        [FEATURE_ID_PROPERTY]: featureId,
        shape: "rectangle",
      },
    };
  };

  for (let lng = -10; lng < 10; lng += step) {
    for (let lat = 56; lat > 46; lat -= step) {
      const bbox: Array<LngLat> = [
        [lng, lat],
        [lng + size, lat],
        [lng + size, lat - size],
        [lng, lat - size],
        [lng, lat],
      ];
      const feature =
        geometry === "rectangle"
          ? createPolygonFeature(bbox)
          : createCircleFeature(bbox);

      geoJson.features.push(feature);
    }
  }

  return geoJson;
};

function instanciateGeoman(
  gm: Geoman | null,
  options: GmOptionsPartial,
  geometry: "rectangle" | "circle"
) {
  if (gm) {
    gm.destroy({ removeSources: true });
  }

  gm = new Geoman(map, options);

  map.once("gm:loaded", () => {
    geoman?.features.importGeoJson(
      loadStressTestFeatureCollection(0.2, 0.18, geometry)
    );
  });

  return gm;
}

const buttonHandlers = {
  "#b-throttling-1": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 1,
        mergeDiff: false,
      },
    }, "rectangle");
  },
  "#b-throttling-10": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 10,
        mergeDiff: false,
      },
    }, "rectangle");
  },

  "#b-throttling-100": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 100,
        mergeDiff: false,
      },
    }, "rectangle");
  },
  "#b-mergeDiff-throttling-1": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 1,
        mergeDiff: true,
      },
    }, "rectangle");
  },
  "#b-mergeDiff-throttling-10": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 10,
        mergeDiff: true,
      },
    }, "rectangle");
  },
  "#b-mergeDiff-throttling-100": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 100,
        mergeDiff: true,
      },
    }, "rectangle");
  },

    "#b-circle-throttling-1": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 1,
        mergeDiff: false,
      },
    }, "circle");
  },
  "#b-circle-throttling-10": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 10,
        mergeDiff: false,
      },
    }, "circle");
  },

  "#b-circle-throttling-100": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 100,
        mergeDiff: false,
      },
    }, "circle");
  },
  "#b-circle-mergeDiff-throttling-1": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 1,
        mergeDiff: true,
      },
    }, "circle");
  },
  "#b-circle-mergeDiff-throttling-10": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 10,
        mergeDiff: true,
      },
    }, "circle");
  },
  "#b-circle-mergeDiff-throttling-100": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 100,
        mergeDiff: true,
      },
    }, "circle");
  },
};

Object.entries(buttonHandlers).forEach(([selector, handler]) => {
  document.querySelector(selector)?.addEventListener("click", handler);
});
