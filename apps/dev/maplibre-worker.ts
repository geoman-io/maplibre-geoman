import * as ml from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

// MapLibre GL JS v6 no longer resolves its own worker when the library is bundled, so the
// host app has to point it at one. Importing this module for its side effect wires that up
// for every dev/test entry point; it must run before the first `new ml.Map()`.
ml.setWorkerUrl(workerUrl);
