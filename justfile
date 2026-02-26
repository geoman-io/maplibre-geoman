pack-maplibre:
  npm run pack -w @geoman-io/maplibre-geoman-free

pack-mapbox:
  npm run pack -w @geoman-io/mapbox-geoman-free

pack: pack-maplibre pack-mapbox

publish-maplibre:
  cd packages/maplibre && npm publish --access public --provenance

publish-mapbox:
  cd packages/mapbox && npm publish --access public --provenance

publish: publish-maplibre publish-mapbox
