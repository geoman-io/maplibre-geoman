# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed

- Dev panel "Clear All Shapes" now properly clears the internal featureStore ([#112](https://github.com/geoman-io/maplibre-geoman/pull/112))
  - **Root cause**: `clearAllShapes` was calling `feature.delete()` which only removed features from the MapLibre source but left stale entries in `featureStore`, causing "feature already exists" errors on reimport.
  - **Solution**: Use `geoman.features.deleteAll()` which properly clears both the source and featureStore.
- Updated maplibre-gl to 5.15.0
- Expanded peerDependencies to support maplibre-gl >=5.14.0
- Increased Playwright CI workers from 1 to 4 for faster test runs
- CI now cancels in-progress runs when new commits are pushed to a PR

## [0.5.9] - 2025-12-18

### Fixed

- Circle features now appear in `source.getGeoJson()` immediately after creation ([#110](https://github.com/geoman-io/maplibre-geoman/pull/110))
  - **Root cause**: When creating circles, `setShapeProperty()` was called to set the center, which queued an `update` diff before the `add` diff. MapLibre processes diffs in order (remove → add → update), so the update for the non-existent feature was silently ignored.
  - **Solution**: Set the center property directly on the GeoJSON object before queuing the add diff, avoiding the race condition.

- Drag events (`gm:dragstart`, `gm:drag`, `gm:dragend`) now fire in correct order to user event listeners ([#110](https://github.com/geoman-io/maplibre-geoman/pull/110))
  - **Root cause**: Event forwarding to users was fire-and-forget (`processEvent().then()`), causing concurrent async processing with no ordering guarantee.
  - **Solution**: Chain event forwarding using a promise queue to ensure events are delivered in the order they were fired internally.

- Improved `waitForPendingUpdates` reliability for edge cases where MapLibre's internal `_isUpdatingWorker` guard caused early promise resolution ([#110](https://github.com/geoman-io/maplibre-geoman/pull/110))

### Changed

- `exportGeoJson()` now uses internal `FeatureData` state (`getGmGeoJson()`) instead of MapLibre's `serialize()`, ensuring newly created features are always included even during event handlers ([#110](https://github.com/geoman-io/maplibre-geoman/pull/110))

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
