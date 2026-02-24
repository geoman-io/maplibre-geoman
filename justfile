pack-maplibre:
  npm run build
  rm -rf pub-maplibre
  mkdir -p pub-maplibre/dist
  cp dist/maplibre-geoman.es.js pub-maplibre/dist
  cp dist/maplibre-geoman.es.js.map pub-maplibre/dist
  cp dist/maplibre-geoman.umd.js pub-maplibre/dist
  cp dist/maplibre-geoman.umd.js.map pub-maplibre/dist
  cp dist/maplibre-geoman.css pub-maplibre/dist
  cp dist/maplibre-geoman.d.ts pub-maplibre/dist
  cp packages/maplibre/package.json pub-maplibre
  cp README.md pub-maplibre
  cp LICENSE pub-maplibre
  cp CONTRIBUTING.md pub-maplibre
  cp CODE_OF_CONDUCT.md pub-maplibre
  cp SECURITY.md pub-maplibre
  cd pub-maplibre && npm pack

pack-mapbox:
  npm run build:mapbox
  rm -rf pub-mapbox
  mkdir -p pub-mapbox/dist
  cp dist/mapbox-geoman.es.js pub-mapbox/dist
  cp dist/mapbox-geoman.es.js.map pub-mapbox/dist
  cp dist/mapbox-geoman.umd.js pub-mapbox/dist
  cp dist/mapbox-geoman.umd.js.map pub-mapbox/dist
  cp dist/mapbox-geoman.css pub-mapbox/dist
  cp dist/mapbox-geoman.d.ts pub-mapbox/dist
  cp packages/mapbox/package.json pub-mapbox
  cp README.md pub-mapbox
  cp LICENSE pub-mapbox
  cp CONTRIBUTING.md pub-mapbox
  cp CODE_OF_CONDUCT.md pub-mapbox
  cp SECURITY.md pub-mapbox
  cd pub-mapbox && npm pack

pack: pack-maplibre

publish: pack-maplibre
  cd pub-maplibre && npm publish
