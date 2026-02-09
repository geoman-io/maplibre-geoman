# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed

- Snapping tolerance and DOM marker width conflict ([#136](https://github.com/geoman-io/maplibre-geoman/issues/136))
  - When drawing a polygon with snapping enabled, clicking within the snapping tolerance (18px) but outside the marker DOM element (~10.5px) now correctly closes the polygon
  - Previously, this created a duplicate vertex that permanently blocked polygon closure
  - Added proximity-based fallback marker detection consistent with the snapping system's tolerance

### Added

- Configurable snapping tolerance via `settings.snapDistance` option
  - Default remains 18px for backward compatibility
  - Developers can now set the snapping tolerance at initialization or change it at runtime
  - The dev panel "Snap Distance (px)" input is now wired to this setting

### Changed

- Update all dependencies
  - @turf/* packages from 7.3.3 to 7.3.4
  - @playwright/test and playwright from 1.58.1 to 1.58.2
  - @types/node from 25.1.0 to 25.2.2
  - svelte from 5.49.1 to 5.50.0
  - type-fest from 5.4.3 to 5.4.4
  - globals from 17.2.0 to 17.3.0

## [0.6.2] - 2026-02-01

### Added

- Optional ordering of controls ([#135](https://github.com/geoman-io/maplibre-geoman/pull/135))
  - Controls can now be ordered by specifying a custom order
  - Maintains insertion-based sort order for backwards compatibility when no order is specified

### Fixed

- Prioritize special shape when querying map features ([#124](https://github.com/geoman-io/maplibre-geoman/pull/124))
  - Fixes issue where special shapes (like circles) were not correctly prioritized during feature queries

- Text marker properties are now correctly applied during drawing (7f797c9)

### Changed

- Update @turf dependencies to 7.3.3 ([#134](https://github.com/geoman-io/maplibre-geoman/pull/134))

- Use cross platform commands in package.json ([#123](https://github.com/geoman-io/maplibre-geoman/pull/123))
  - Build scripts now work consistently across Windows, macOS, and Linux

## [0.6.1] - 2025-12-20

### Fixed

- Race condition in `waitForBaseMap` causing initialization timeout ([#119](https://github.com/geoman-io/maplibre-geoman/pull/119))
  - **Root cause**: The map 'load' event could fire between checking `isLoaded()` and registering the event listener, causing a 60-second timeout
  - **Solution**: Fixed the classic race condition with proper event listener cleanup and added error handling for initialization failures with cleanup via `destroy()`
  - Properly removes dangling `once()` listeners in `waitForBaseMap` and `waitForGeomanLoaded`
  - Added destroyed state check in `waitForGeomanLoaded` to prevent timeout when initialization has already failed
  - `createGeomanInstance` now throws an error on initialization failure instead of returning a destroyed instance
  - Fixes [#106](https://github.com/geoman-io/maplibre-geoman/issues/106)

- Empty toolbar groups now hidden and marker temporary styles are respected ([#117](https://github.com/geoman-io/maplibre-geoman/pull/117))
  - Only render control group containers when they have visible controls
  - Added `display: contents` to geoman-controls wrapper so control groups participate directly in MapLibre's control container flexbox layout
  - Apply `icon-opacity` and `icon-size` from `layerStyles.marker.gm_temporary` to the DOM marker preview during draw mode
  - Fixes toolbar positioning issues when used with React Map GL
  - Fixes empty divs pushing other MapLibre controls out of alignment
  - Fixes custom marker temporary styles not being applied during draw
  - Also fixes Svelte 5 reactivity warning in control-menu.svelte by using `$derived()` for values derived from props
  - Closes [#107](https://github.com/geoman-io/maplibre-geoman/issues/107)

### Changed

- Run prettier formatter on codebase ([#118](https://github.com/geoman-io/maplibre-geoman/pull/118))

## [0.6.0] - 2025-12-19

### Added

- `overwrite` option for `importGeoJson()` to replace existing features with the same ID ([#113](https://github.com/geoman-io/maplibre-geoman/issues/113))
  - When `overwrite: true`, existing features with matching IDs are deleted before importing the new feature
  - Import result now includes `stats.overwritten` count to track how many features were replaced

- New simplified feature data API for `FeatureData` ([#77](https://github.com/geoman-io/maplibre-geoman/issues/77))
  - `updateProperties(properties)` - Merge properties with existing ones; set a property to `undefined` to delete it
  - `setProperties(properties)` - Replace all custom properties completely
  - `updateGeometry(geometry)` - Update the feature's geometry
  - Property methods protect internal Geoman properties (prefixed with `gm_`) from modification
  - Example usage:

    ```typescript
    // Add or update properties
    feature.updateProperties({ color: 'red', size: 10 });

    // Delete a property by setting to undefined
    feature.updateProperties({ color: undefined });

    // Replace all custom properties
    feature.setProperties({ name: 'New Feature' });

    // Update geometry
    feature.updateGeometry({ type: 'Point', coordinates: [10, 52] });
    ```

- `exportGeoJsonFromSource()` method to export GeoJSON directly from MapLibre's underlying source
  - Reads from MapLibre's serialized source state (via `serialize()`)
  - Useful for debugging, verification, or synchronization with external systems
  - For most use cases, prefer `exportGeoJson()` which uses Geoman's internal state and is always up-to-date
  - Example usage:

    ```typescript
    // Export from internal Geoman state (recommended)
    const geoJson = geoman.features.exportGeoJson();

    // Export from MapLibre's source (for debugging/verification)
    const sourceGeoJson = geoman.features.exportGeoJsonFromSource();
    ```

### Changed

- **BREAKING**: `importGeoJson()` signature changed from `importGeoJson(geoJson, idPropertyName?)` to `importGeoJson(geoJson, options?)`

  Migration:

  ```typescript
  // Before
  geoman.features.importGeoJson(geoJson, 'customIdProperty');

  // After
  geoman.features.importGeoJson(geoJson, { idPropertyName: 'customIdProperty' });

  // New overwrite feature
  geoman.features.importGeoJson(geoJson, { overwrite: true });

  // Both options together
  geoman.features.importGeoJson(geoJson, {
    idPropertyName: 'customIdProperty',
    overwrite: true,
  });
  ```

### Deprecated

- `updateGeoJsonProperties()` - Use `updateProperties()` instead (or `_updateAllProperties()` for internal use)
- `setGeoJsonCustomProperties()` - Use `setProperties()` instead
- `updateGeoJsonCustomProperties()` - Use `updateProperties()` instead
- `deleteGeoJsonCustomProperties()` - Use `updateProperties({ propName: undefined })` instead
- `updateGeoJsonGeometry()` - Use `updateGeometry()` instead

### Fixed

- Property deletion now works correctly without causing MapLibre encoding errors ([#77](https://github.com/geoman-io/maplibre-geoman/issues/77))
  - **Root cause**: Setting properties to `undefined` caused "unknown feature value" errors because the Mapbox Vector Tile specification does not support undefined values. When a feature with undefined properties was merged into a pending "add" operation (via `mergeGeoJsonDiff`), the undefined values were passed directly to MapLibre's `updateData()` without conversion.
  - **Solution**:
    1. Added `sanitizeFeatureForAdd()` in `MaplibreSource` to strip undefined values from features being added to the source
    2. The existing `convertFeatureToMlUpdateDiff()` correctly converts undefined values to MapLibre's `removeProperties` array for update operations
  - **Technical details**: MapLibre's `GeoJSONSourceDiff` supports property removal via `GeoJSONFeatureDiff.removeProperties`, but the "add" path bypasses this conversion. The fix ensures both add and update paths handle undefined values correctly.

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
