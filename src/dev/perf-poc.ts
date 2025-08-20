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
  GmOptions,
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

const loadStressTestFeatureCollection = (step: number, size: number) => {
  const geoJson: GeoJsonImportFeatureCollection = {
    type: "FeatureCollection",
    features: [],
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
      const feature = createPolygonFeature([
        [lng, lat],
        [lng + size, lat],
        [lng + size, lat - size],
        [lng, lat - size],
        [lng, lat],
      ]);

      geoJson.features.push(feature);
    }
  }

  return geoJson;
};

function instanciateGeoman(gm: Geoman | null, options: GmOptionsPartial) {
    if (gm) {
      gm.destroy({removeSources: true})
    }

    gm = new Geoman(map, options);

    map.once("gm:loaded", () => {
      geoman?.features.importGeoJson(
        loadStressTestFeatureCollection(0.2, 0.18)
      );
    });

    return gm
}

const buttonHandlers = {
  "#b-throttling-1": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 1,
        mergeDiff: false,
      },
    })
  },
    "#b-throttling-10": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 10,
        mergeDiff: false,
      },
    })
  },

  "#b-throttling-100": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 100,
        mergeDiff: false,
      },
    })
  },
  "#b-mergeDiff-throttling-1": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 1,
        mergeDiff: true,
      },
    })
  },
    "#b-mergeDiff-throttling-10": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 10,
        mergeDiff: true,
      },
    })
  },
  "#b-mergeDiff-throttling-100": async () => {
    geoman = instanciateGeoman(geoman, {
      settings: {
        throttlingDelay: 100,
        mergeDiff: true,
      },
    })
  },


};

Object.entries(buttonHandlers).forEach(([selector, handler]) => {
  document.querySelector(selector)?.addEventListener("click", handler);
});
