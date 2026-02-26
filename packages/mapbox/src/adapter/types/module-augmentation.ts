// Mapbox GL JS's Map.on/once/off methods already accept arbitrary string
// event names via `string & {}`, so custom Geoman events (e.g. 'gm:loaded')
// work without module augmentation. This file exists as a no-op counterpart
// to the MapLibre module augmentation.
