/* A MapLibre Plugin For Drawing and Editing Geometry Layers
 * Copyright (C) Geoman.io - All Rights Reserved
 */
import defaultMarker from '@/assets/images/markers/default-marker.png';
import { GM_PREFIX, GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import GmControl from '@/core/controls/index.ts';
import { type EventForwarder } from '@/core/events/forwarder.ts';
import GmEvents from '@/core/events/index.ts';
import { Features } from '@/core/features/index.ts';
import { BaseMapAdapter } from '@/core/map/base/index.ts';
import { getMapAdapter } from '@/core/map/index.ts';
import { GmOptions } from '@/core/options/index.ts';
import { BaseDraw } from '@/modes/draw/base.ts';

import { drawClassMap } from '@/modes/draw/index.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { editClassMap } from '@/modes/edit/index.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';
import { helperClassMap } from '@/modes/helpers/index.ts';
import '@mapLib/style.css';
import '@/styles/style.css';
import type { ModeName } from '@/types/controls.ts';
import type { GmControlLoadEvent } from '@/types/index.ts';
import { type AnyMapInstance, type LngLatTuple } from '@/types/map/index.ts';
import {
  type ActionInstance,
  type ActionInstanceKey,
  type DrawModeName,
  type EditModeName,
  type HelperModeName,
} from '@/types/modes/index.ts';
import type { GmOptionsData, ModeType } from '@/types/options.ts';
import { MarkerPointer } from '@/utils/draw/marker-pointer.ts';
import { isMapWithOnceMethod } from '@/utils/guards/map.ts';
import { isGmDrawEvent, isModeName, isModeType } from '@/utils/guards/modes.ts';
import { typedKeys } from '@/utils/typing.ts';
import log from 'loglevel';
import type { PartialDeep } from 'type-fest';
import { withPromiseTimeoutRace } from '@/utils/behavior.ts';

const BASE_MAP_WAIT_ABORTED = 'waitForBaseMap aborted';

// declare module 'maplibre-gl' {
//   interface Map {
//     gm?: Geoman;
//   }
// }

export class Geoman {
  mapAdapterInstance: BaseMapAdapter<AnyMapInstance> | null = null;
  globalLngLatBounds: [LngLatTuple, LngLatTuple] = this.getGlobalLngLatBounds();
  features: Features;
  loaded: boolean = false;
  destroyed: boolean = false;

  options: GmOptions;
  events: GmEvents;
  control: GmControl;

  actionInstances: { [key in ActionInstanceKey]?: ActionInstance } = {};
  markerPointer: MarkerPointer;

  /** @internal Cleanup handle for a pending waitForBaseMap promise. */
  _pendingBaseMapCleanup: (() => void) | undefined;
  /** @internal Abort handle for a pending waitForBaseMap promise. */
  _pendingBaseMapAbort: (() => void) | undefined;
  /** @internal Cached promise so concurrent callers share the same wait. */
  _pendingBaseMapWait: Promise<unknown> | undefined;

  constructor(map: AnyMapInstance, options: PartialDeep<GmOptionsData> = {}) {
    this.options = this.initCoreOptions(options);
    this.events = this.initCoreEvents();
    this.features = this.initCoreFeatures();
    this.control = this.initCoreControls();
    this.markerPointer = this.initMarkerPointer();

    const mapWithGeoman = Object.assign(map, { gm: this });
    this.mapAdapterInstance = getMapAdapter(this, mapWithGeoman);

    this.waitForBaseMap()
      .then(this.init.bind(this))
      .catch((error) => {
        const isAbortError =
          error instanceof Error && error.message.includes(BASE_MAP_WAIT_ABORTED);
        if (isAbortError && this.destroyed) {
          return;
        }
        log.error('Geoman initialization failed:', error);
        // Use destroy() for proper cleanup of any registered events/resources.
        // Note: destroy() is async but we don't need to await it here since
        // we're in a fire-and-forget catch block and destroy() handles the
        // not-yet-loaded case synchronously for the critical cleanup paths.
        this.destroy();
      });
  }

  get drawClassMap() {
    return drawClassMap;
  }

  get editClassMap() {
    return editClassMap;
  }

  get helperClassMap() {
    return helperClassMap;
  }

  get mapAdapter(): BaseMapAdapter<AnyMapInstance> {
    if (this.mapAdapterInstance) {
      return this.mapAdapterInstance;
    }
    log.trace('Map adapter is not initialized');
    throw new Error('Map adapter is not initialized');
  }

  initCoreOptions(options: PartialDeep<GmOptionsData> = {}) {
    return new GmOptions(this, options);
  }

  initCoreEvents() {
    return new GmEvents(this);
  }

  initCoreFeatures() {
    return new Features(this);
  }

  initCoreControls() {
    return new GmControl(this);
  }

  initMarkerPointer() {
    return new MarkerPointer(this);
  }

  addControls(controlsElement: HTMLElement | undefined = undefined) {
    return new Promise<void>((resolve) => {
      const handleCreateControls = async () => {
        if (controlsElement) {
          this.control.createControls(controlsElement);
        } else {
          this.mapAdapter.addControl(this.control);
        }
        await this.onMapLoad();
        resolve();
      };

      handleCreateControls().then();
    });
  }

  async waitForBaseMap() {
    const map = this.mapAdapter.mapInstance;
    if (!isMapWithOnceMethod(map)) {
      log.error('Map instance does not have a "once" method', map);
      return;
    }

    // Fast path: if already loaded, return immediately
    if (this.mapAdapter.isLoaded()) {
      return map;
    }

    // If a wait is already in progress, join the same promise so concurrent
    // callers (e.g. the constructor's fire-and-forget call and an explicit
    // await) don't clobber each other's cleanup/abort handles.
    if (this._pendingBaseMapWait) {
      await this._pendingBaseMapWait;
      return map;
    }

    // We store cleanup handles so destroy() can abort the wait if the Geoman
    // instance is torn down before the map finishes loading.
    this._pendingBaseMapWait = withPromiseTimeoutRace(
      new Promise<unknown>((resolve, reject) => {
        // --- 1. Listen for the 'load' event (primary signal) -----------------
        const onLoad = () => {
          cleanup();
          resolve(map);
        };
        map.once('load', onLoad);

        // --- 2. Listen for 'error' events (logging only) ---------------------
        // MapLibre fires ErrorEvent when the style URL is unreachable, CORS
        // fails, etc.  We log these for debugging but do NOT reject the
        // promise — non-critical errors (e.g. failed sprite load) can fire
        // before the 'load' event and would falsely kill initialization.
        const onError = (event: unknown) => {
          const errorObj =
            event && typeof event === 'object' && 'error' in event
              ? (event as { error: Error }).error
              : event;
          log.warn('waitForBaseMap: map error during initialization', errorObj);
        };
        const mapAny = map as unknown as Record<string, unknown>;
        if (typeof mapAny.on === 'function') {
          (mapAny.on as (type: string, fn: (e: unknown) => void) => void)('error', onError);
        }

        // --- 3. Polling fallback ---------------------------------------------
        // MapLibre only fires the 'load' event from within _render(), which is
        // driven by requestAnimationFrame. Browsers heavily throttle or pause
        // rAF for background tabs, so the 'load' event may never fire even
        // though the style data has already been downloaded. We periodically
        // poll isLoaded() as a safety net.
        const POLL_INTERVAL_MS = 2000;
        const pollTimer = setInterval(() => {
          if (this.mapAdapter.isLoaded()) {
            cleanup();
            resolve(map);
          }
        }, POLL_INTERVAL_MS);

        // --- 4. Visibility change handler ------------------------------------
        // When the user returns to the tab after it was backgrounded, check
        // immediately rather than waiting for the next poll tick.
        const onVisibilityChange = () => {
          if (document.visibilityState === 'visible' && this.mapAdapter.isLoaded()) {
            cleanup();
            resolve(map);
          }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        // --- Cleanup helper --------------------------------------------------
        // Removes all listeners/timers. Safe to call multiple times.
        // Each step is wrapped individually so that a failure in one
        // (e.g. map.off throwing) does not prevent the others from running.
        let cleaned = false;
        const cleanup = () => {
          if (cleaned) return;
          cleaned = true;
          try {
            map.off('load', onLoad);
          } catch {
            /* best-effort */
          }
          try {
            if (typeof mapAny.off === 'function') {
              (mapAny.off as (type: string, fn: (e: unknown) => void) => void)('error', onError);
            }
          } catch {
            /* best-effort */
          }
          try {
            clearInterval(pollTimer);
          } catch {
            /* best-effort */
          }
          try {
            document.removeEventListener('visibilitychange', onVisibilityChange);
          } catch {
            /* best-effort */
          }
        };

        // Store the handles so destroy() can abort and settle immediately.
        this._pendingBaseMapCleanup = cleanup;
        this._pendingBaseMapAbort = () => {
          cleanup();
          reject(new Error(BASE_MAP_WAIT_ABORTED));
        };

        // --- 5. Race-condition double-check ----------------------------------
        // Close the window between the isLoaded() check at the top and the
        // once('load') registration above (see maplibre-gl-js#4024).
        if (this.mapAdapter.isLoaded()) {
          cleanup();
          resolve(map);
        }
      }),
      'waitForBaseMap failed',
      // onTimeout: clean up dangling listeners when the race times out
      () => {
        this._pendingBaseMapCleanup?.();
        this._pendingBaseMapCleanup = undefined;
        this._pendingBaseMapAbort = undefined;
      },
    );

    try {
      await this._pendingBaseMapWait;
    } finally {
      this._pendingBaseMapWait = undefined;
      this._pendingBaseMapCleanup = undefined;
      this._pendingBaseMapAbort = undefined;
    }
    return map;
  }

  async waitForGeomanLoaded(): Promise<Geoman | undefined> {
    if (this.loaded) {
      return this;
    }

    // If destroyed (e.g., initialization failed), return undefined immediately
    // to prevent callers from waiting on a timeout
    if (this.destroyed) {
      return;
    }

    const map = await this.waitForBaseMap();
    if (!map) {
      log.error('Map instance is not available', map);
      return;
    }

    // Same race condition fix as waitForBaseMap - check loaded state after
    // registering the listener to close the timing window
    const eventName = `${GM_PREFIX}:loaded`;
    let onLoaded: (() => void) | undefined;

    await withPromiseTimeoutRace(
      new Promise((resolve) => {
        onLoaded = () => resolve(this);
        map.once(eventName, onLoaded);

        // Check if loaded between the this.loaded check above and the once() call.
        // If so, remove the listener and resolve immediately.
        if (this.loaded) {
          map.off(eventName, onLoaded);
          resolve(this);
        }
      }),
      'waitForGeomanLoaded failed',
      // onTimeout: clean up the dangling once() listener
      () => {
        if (onLoaded) {
          map.off(eventName, onLoaded);
        }
      },
    );
    return this;
  }

  async init() {
    // Check if destroyed before continuing initialization
    if (this.destroyed) {
      return;
    }
    this.features.init();

    // Check again after features init, before async controls
    if (this.destroyed) {
      return;
    }
    await this.addControls();
  }

  /**
   * Destroys the Geoman instance and cleans up resources.
   *
   * This method can be called at any point in the lifecycle:
   * - Before initialization completes: cancels pending init and cleans up synchronously
   * - After initialization completes: performs full cleanup including controls
   *
   * For React StrictMode compatibility, this method performs synchronous cleanup
   * of the `gm` reference on the map instance, allowing immediate re-initialization.
   */
  async destroy({ removeSources }: { removeSources: boolean } = { removeSources: false }) {
    // Mark as destroyed early to prevent init() from continuing
    this.destroyed = true;

    // Synchronously remove gm reference to allow re-initialization
    // This is critical for React StrictMode compatibility
    if (this.mapAdapterInstance && 'gm' in this.mapAdapterInstance.mapInstance) {
      delete this.mapAdapterInstance.mapInstance.gm;
    }

    // Clean up any pending waitForBaseMap listeners/timers that were
    // registered directly on the map instance (not via the event bus).
    this._pendingBaseMapAbort?.();
    this._pendingBaseMapAbort = undefined;
    this._pendingBaseMapCleanup = undefined;
    this._pendingBaseMapWait = undefined;

    // Only perform full cleanup if initialization completed
    if (this.loaded) {
      // removeControls() will detach events via control.onRemove()
      this.removeControls();
      // Remove images that were added during initialization
      this.mapAdapter.removeImage('default-marker');
    } else {
      // If not loaded, detach any events that may have been registered
      this.events.bus.detachAllEvents();
    }

    if (removeSources) {
      for (const source of Object.values(this.features.sources)) {
        if (source) {
          source.remove();
        }
      }
    }
  }

  removeControls() {
    this.disableAllModes();
    this.mapAdapter.removeControl(this.control);
  }

  async onMapLoad() {
    if (this.loaded || this.destroyed) {
      return;
    }

    await this.mapAdapter.loadImage({
      id: 'default-marker',
      image: defaultMarker,
    });

    // Check if destroyed after async operation
    if (this.destroyed) {
      return;
    }

    const payload: GmControlLoadEvent = {
      name: `${GM_SYSTEM_PREFIX}:control:load`,
      level: 'system',
      actionType: 'control',
      action: 'loaded',
    };
    this.events.fire(`${GM_SYSTEM_PREFIX}:control`, payload);
    this.loaded = true;
  }

  disableAllModes() {
    typedKeys(this.actionInstances).forEach((key) => {
      const [actionType, mode] = key.split('__');

      if (isModeType(actionType) && isModeName(mode)) {
        this.options.disableMode(actionType, mode);
      }
    });
  }

  getActiveDrawModes(): Array<DrawModeName> {
    return typedKeys(this.actionInstances)
      .map((key) => {
        const instance = this.actionInstances[key];
        return instance instanceof BaseDraw ? instance.mode : null;
      })
      .filter((mode): mode is DrawModeName => mode !== null);
  }

  getActiveEditModes(): Array<EditModeName> {
    return typedKeys(this.actionInstances)
      .map((key) => {
        const instance = this.actionInstances[key];
        return instance instanceof BaseEdit ? instance.mode : null;
      })
      .filter((mode): mode is EditModeName => mode !== null);
  }

  getActiveHelperModes(): Array<HelperModeName> {
    return typedKeys(this.actionInstances)
      .map((key) => {
        const instance = this.actionInstances[key];
        return instance instanceof BaseHelper ? instance.mode : null;
      })
      .filter((mode): mode is HelperModeName => mode !== null);
  }

  getGlobalLngLatBounds(): [LngLatTuple, LngLatTuple] {
    // these coordinates are used to restrict the map to the maximum possible bounds
    // mercator projection is used for the map, so the maximum latitude is MAX_VALID_LATITUDE
    // import { MAX_VALID_LATITUDE } from 'maplibre-gl/src/geo/transform.ts';

    const MAX_VALID_LATITUDE = 85.051129;
    return [
      [-179.99999, -MAX_VALID_LATITUDE],
      [179.99999, MAX_VALID_LATITUDE],
    ];
  }

  setGlobalEventsListener(callback: EventForwarder['globalEventsListener'] = null) {
    this.events.bus.forwarder.globalEventsListener = callback;
  }

  createSvgMarkerElement(
    type: keyof GmOptions['settings']['markerIcons'],
    style: Partial<CSSStyleDeclaration> | undefined = undefined,
  ): HTMLElement {
    const markerIcons = this.options.settings.markerIcons;

    if (!markerIcons[type]) {
      log.error(`createMarkerElement: marker type "${type}" not found`);
    }

    const element = document.createElement('div');
    element.classList.add('marker-wrapper');
    element.style.lineHeight = '0';

    element.innerHTML = markerIcons[type] || 'NO_ICON';
    const svgElement = element.firstChild as HTMLElement;

    if (typeof svgElement !== 'object') {
      log.error(`createMarkerElement: no icon "${type}" found`);
      throw new Error(`No icon "${type}" found`);
    }

    if (style) {
      Object.assign(svgElement.style, style);
    }

    return element;
  }

  enableMode(actionType: ModeType, modeName: ModeName) {
    this.options.enableMode(actionType, modeName);
  }

  disableMode(actionType: ModeType, modeName: ModeName) {
    this.options.disableMode(actionType, modeName);
  }

  toggleMode(actionType: ModeType, modeName: ModeName) {
    this.options.toggleMode(actionType, modeName);
  }

  isModeEnabled(actionType: ModeType, modeName: ModeName) {
    return this.options.isModeEnabled(actionType, modeName);
  }

  // helper methods for compatibility with the old API
  // draw (draw:*)
  enableDraw(shape: DrawModeName) {
    this.options.enableMode('draw', shape);
  }

  disableDraw() {
    this.getActiveDrawModes().forEach((shape) => this.options.disableMode('draw', shape));
  }

  toggleDraw(shape: DrawModeName) {
    this.options.toggleMode('draw', shape);
  }

  drawEnabled(shape: DrawModeName) {
    return this.options.isModeEnabled('draw', shape);
  }

  // drag(edit:drag)
  enableGlobalDragMode() {
    this.options.enableMode('edit', 'drag');
  }

  disableGlobalDragMode() {
    this.options.disableMode('edit', 'drag');
  }

  toggleGlobalDragMode() {
    this.options.toggleMode('edit', 'drag');
  }

  globalDragModeEnabled() {
    return this.options.isModeEnabled('edit', 'drag');
  }

  // edit (edit:change)
  enableGlobalEditMode() {
    this.options.enableMode('edit', 'change');
  }

  disableGlobalEditMode() {
    this.options.disableMode('edit', 'change');
  }

  toggleGlobalEditMode() {
    this.options.toggleMode('edit', 'change');
  }

  globalEditModeEnabled() {
    return this.options.isModeEnabled('edit', 'change');
  }

  // rotate (edit:rotate)
  enableGlobalRotateMode() {
    this.options.enableMode('edit', 'rotate');
  }

  disableGlobalRotateMode() {
    this.options.disableMode('edit', 'rotate');
  }

  toggleGlobalRotateMode() {
    this.options.toggleMode('edit', 'rotate');
  }

  globalRotateModeEnabled() {
    return this.options.isModeEnabled('edit', 'rotate');
  }

  // cut (edit:cut)
  enableGlobalCutMode() {
    this.options.enableMode('edit', 'cut');
  }

  disableGlobalCutMode() {
    this.options.disableMode('edit', 'cut');
  }

  toggleGlobalCutMode() {
    this.options.toggleMode('edit', 'cut');
  }

  globalCutModeEnabled() {
    return this.options.isModeEnabled('edit', 'cut');
  }

  // remove (edit:delete)
  enableGlobalRemovalMode() {
    this.options.enableMode('edit', 'delete');
  }

  disableGlobalRemovalMode() {
    this.options.disableMode('edit', 'delete');
  }

  toggleGlobalRemovalMode() {
    this.options.toggleMode('edit', 'delete');
  }

  globalRemovalModeEnabled() {
    return this.options.isModeEnabled('edit', 'delete');
  }
}

export const createGeomanInstance = async (
  map: AnyMapInstance,
  options: PartialDeep<GmOptionsData>,
) => {
  const geoman = new Geoman(map, options);
  const result = await geoman.waitForGeomanLoaded();

  // If initialization failed (destroyed or returned undefined), throw an error
  if (!result || geoman.destroyed) {
    throw new Error('Geoman initialization failed');
  }

  return geoman;
};

// export all possible types to make them available in rollup-dts
export * from '@/types/index.ts';

// constants
export { controlIcons } from '@/core/options/icons.ts';
export { default as defaultLayerStyles } from '@/core/options/layers/style.ts';
export { customShapeRectangle, customShapeTriangle } from '@/core/options/shapes.ts';

// core classes
export { GmOptions } from '@/core/options/index.ts';
export { drawClassMap, editClassMap, helperClassMap };

// utils
export { mergeByTypeCustomizer } from '@/core/options/utils.ts';
export { convertToThrottled } from '@/utils/behavior.ts';
export { isGeoJsonFeatureInPolygon, moveFeatureData, moveGeoJson } from '@/utils/features.ts';
export {
  boundsContains,
  boundsToBBox,
  calculatePerimeter,
  convertToLineStringFeatureCollection,
  eachCoordinateWithPath,
  eachSegmentWithPath,
  findCoordinateWithPath,
  geoJsonPointToLngLat,
  getEuclideanDistance,
  getEuclideanSegmentNearestPoint,
  getGeoJsonCoordinatesCount,
  getGeoJsonFirstPoint,
  getLngLatDiff,
  isEqualPosition,
  isMultiPolygonFeature,
  isPolygonFeature,
  lngLatToGeoJsonPoint,
  twoCoordsToLineString,
} from '@/utils/geojson.ts';
export { formatArea, formatDistance, toMod } from '@/utils/number.ts';
export { includesWithType, typedKeys } from '@/utils/typing.ts';

// guards
export {
  isGmDrawFreehandDrawerEvent,
  isGmDrawLineDrawerEvent,
  isGmDrawShapeEvent,
} from '@/utils/guards/events/draw.ts';
export { isGmEditEvent } from '@/utils/guards/events/edit.ts';
export {
  isGmFeatureBeforeCreateEvent,
  isGmFeatureBeforeUpdateEvent,
} from '@/utils/guards/events/features.ts';
export { isGmHelperEvent } from '@/utils/guards/events/helper.ts';
export { isGmControlEvent, isGmEvent } from '@/utils/guards/events/index.ts';
export * from '@/utils/guards/index.ts';
export { isGmDrawEvent };

// features
export { FeatureData } from '@/core/features/feature-data.ts';

// base adapter classes
export { BaseMapAdapter } from '@/core/map/base/index.ts';
export { BaseLayer } from '@/core/map/base/layer.ts';
export { BaseDomMarker } from '@/core/map/base/marker.ts';
export { BasePopup } from '@/core/map/base/popup.ts';
export { BaseSource } from '@/core/map/base/source.ts';

// base actions
export { BaseAction } from '@/modes/base-action.ts';
export { BaseDraw } from '@/modes/draw/base.ts';
export { BaseDrag } from '@/modes/edit/base-drag.ts';
export { BaseGroupEdit } from '@/modes/edit/base-group.ts';
export { BaseEdit } from '@/modes/edit/base.ts';
export { BaseHelper } from '@/modes/helpers/base.ts';

// specific actions
export { ShapeMarkersHelper } from '@/modes/helpers/shape-markers.ts';
export { LineDrawer } from '@/utils/draw/line-drawer.ts';
export { MarkerPointer } from '@/utils/draw/marker-pointer.ts';

export { GM_PREFIX, IS_PRO } from '@/core/constants.ts';
export { DRAW_MODES } from '@/modes/constants.ts';
export { EXTRA_DRAW_MODES } from '@/modes/constants.ts';
export { SHAPE_NAMES } from '@/modes/constants.ts';
export {
  FEATURE_PROPERTY_PREFIX,
  FEATURE_ID_PROPERTY,
  SOURCES,
} from '@/core/features/constants.ts';
export { HELPER_MODES } from '@/modes/constants.ts';
export { EDIT_MODES } from '@/modes/constants.ts';
export { isGmModeEvent } from '@/utils/guards/events/mode.ts';
