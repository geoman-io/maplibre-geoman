# Changelog

All notable changes to this project will be documented in this file.

## [0.5.9] - Unreleased

### Added

- Property update methods (`updateGeoJsonProperties`, `setGeoJsonCustomProperties`, `updateGeoJsonCustomProperties`, `deleteGeoJsonCustomProperties`) now return `Promise<void>` that resolves when MapLibre commits the data ([#109](https://github.com/geoman-io/maplibre-geoman/pull/109))
  - Enables ergonomic awaiting: `await e.feature.updateGeoJsonProperties({ myProp: 'value' })`
  - Backwards compatible: existing code that doesn't await continues to work
- New `sync()` method on `FeatureData` to explicitly wait for all pending source updates to be committed to MapLibre ([#109](https://github.com/geoman-io/maplibre-geoman/pull/109))

### Fixed

- `exportGeoJson()` and `source.getGeoJson()` now return correct data when called in `gm:create` event handlers ([#109](https://github.com/geoman-io/maplibre-geoman/pull/109), fixes [#84](https://github.com/geoman-io/maplibre-geoman/issues/84))
  - Previously returned empty FeatureCollection because MapLibre source updates are async
  - Now properly tracks update chains from queue to MapLibre commit, including handling `source.loaded=false` edge case
  - Example usage:
    ```typescript
    map.on('gm:create', async (e) => {
      await e.feature.updateGeoJsonProperties({ customProp: 'value' });
      console.log(e.feature.source.getGeoJson()); // Works!
      console.log(geoman.features.exportGeoJson()); // Works!
    });
    ```

### Changed

- `awaitDataUpdatesOnEvents` setting now only applies to `gm:create` events ([#109](https://github.com/geoman-io/maplibre-geoman/pull/109))
  - Edit events like `gm:drag`, `gm:dragstart`, `gm:dragend` no longer wait for source updates, as the feature already exists in the source
  - This prevents event ordering issues where drag events could fire out of sequence

## [0.5.8] - 2025-12-17

### Added

- Interactive dev panels with settings, layer monitoring, and debugging tools ([#102](https://github.com/geoman-io/maplibre-geoman/pull/102))
- Advanced testing for draw and edit modes, including CRUD operations and GeoJSON utilities ([#95](https://github.com/geoman-io/maplibre-geoman/pull/95))
- Prepare script for git installs

### Fixed

- Improved destroy/reinit cleanup for React StrictMode compatibility ([#101](https://github.com/geoman-io/maplibre-geoman/pull/101))
- Test stability after dev panels were added ([#105](https://github.com/geoman-io/maplibre-geoman/pull/105))

## [0.5.7] - 2025-12-16

### Added

- Multi-LineString support ([#89](https://github.com/geoman-io/maplibre-geoman/pull/89))
- New `awaitDataUpdatesOnEvents` setting to control event timing behavior ([#99](https://github.com/geoman-io/maplibre-geoman/pull/99))
  - When `true` (default), events like `gm:create` and `gm:remove` wait for MapLibre to commit data updates before firing, ensuring feature data is accessible via `exportGeoJson()` in event handlers
  - Set to `false` for faster async updates if immediate data consistency in event handlers is not required

### Fixed

- Rectangle drawing initial geometry ([#96](https://github.com/geoman-io/maplibre-geoman/pull/96))
- Event ordering issues by leveraging MapLibre's `updateData` with `waitForCompletion` ([#99](https://github.com/geoman-io/maplibre-geoman/pull/99)). Events like `dragstart`, `drag`, and `dragend` now fire in the correct sequence

## [0.5.6] - 2025-12-12

### Fixed

- Replace `target` property name to `mode` in GmControlEvent ([#92](https://github.com/geoman-io/maplibre-geoman/pull/92))

### Changed

- Bump dependencies ([#94](https://github.com/geoman-io/maplibre-geoman/pull/94))

## [0.5.4] - 2025-12-03

### Changed

- Simplify delayed source update ([#86](https://github.com/geoman-io/maplibre-geoman/pull/86))

## [0.5.3] - 2025-11-06

- Maintenance release

## [0.5.2] - 2025-10-29

- Maintenance release

## [0.5.1] - 2025-10-27

### Changed

- Removed unnecessary dependencies

## [0.5.0] - 2025-10-23

### Added

- Disable edit on a per-feature basis ([#45](https://github.com/geoman-io/maplibre-geoman/pull/45))
- `idPropertyName` option for GeoJSON export ([#71](https://github.com/geoman-io/maplibre-geoman/pull/71))
- Optional `idGenerator` for feature ID creation ([#75](https://github.com/geoman-io/maplibre-geoman/pull/75))
- Geoman event declarations to MapLibre types ([#74](https://github.com/geoman-io/maplibre-geoman/pull/74))
- `deleteAll` method ([#79](https://github.com/geoman-io/maplibre-geoman/pull/79))
