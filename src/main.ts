/* A MapLibre Plugin For Drawing and Editing Geometry Layers
 * Copyright (C) Geoman.io - All Rights Reserved
 */
import defaultMarker from '@/assets/images/markers/default-marker.png';
import GMControl from '@/core/controls/index.ts';
import { type EventForwarder } from '@/core/events/forwarder.ts';
import GMEvents from '@/core/events/index.ts';
import { Features } from '@/core/features/index.ts';
import { BaseMapAdapter } from '@/core/map/base/index.ts';
import { getMapAdapter } from '@/core/map/index.ts';
import { GmOptions } from '@/core/options/index.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';
import type { ModeName } from '@/types/controls.ts';
import { type AnyMapInstance, type LngLat, type MapInstanceWithGeoman } from '@/types/map/index.ts';
import {
  type ActionInstance,
  type ActionInstanceKey,
  type DrawModeName,
  type EditModeName,
  type HelperModeName,
} from '@/types/modes/index.ts';

import { drawClassMap } from '@/modes/draw/index.ts';
import { editClassMap } from '@/modes/edit/index.ts';
import { helperClassMap } from '@/modes/helpers/index.ts';
import '@/styles/map/maplibre.css';
import '@/styles/style.css';
import type { ActionType, GmOptionsData } from '@/types/options.ts';
import { MarkerPointer } from '@/utils/draw/marker-pointer.ts';
import { hasMapOnceMethod } from '@/utils/guards/map.ts';
import { isActionType, isGmDrawEvent, isModeName } from '@/utils/guards/modes.ts';
import { typedKeys } from '@/utils/typing.ts';
import log from 'loglevel';
import type { PartialDeep } from 'type-fest';
import { GM_PREFIX } from '@/core/constants.ts';

// declare module 'maplibre-gl' {
//   interface Map {
//     gm?: Geoman;
//   }
// }

export class Geoman {
  mapAdapterInstance: BaseMapAdapter<AnyMapInstance> | null = null;
  globalLngLatBounds: [LngLat, LngLat] = this.getGlobalLngLatBounds();
  features: Features;
  loaded: boolean = false;

  options: GmOptions;
  events: GMEvents;
  control: GMControl;

  actionInstances: { [key in ActionInstanceKey]?: ActionInstance } = {};
  markerPointer: MarkerPointer;

  constructor(map: AnyMapInstance, options: PartialDeep<GmOptionsData> = {}) {
    const mapWithGeoman = Object.assign(map, { gm: this });

    this.options = this.initCoreOptions(options);
    this.events = this.initCoreEvents();
    this.features = this.initCoreFeatures();
    this.control = this.initCoreControls();
    this.markerPointer = this.initMarkerPointer();

    if (hasMapOnceMethod(map)) {
      if (this.isMapInstanceLoaded(map)) {
        this.init(mapWithGeoman).then();
      } else {
        map.once('load', async () => {
          await this.init(mapWithGeoman);
        });
      }
    }
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
    return new GMEvents(this);
  }

  initCoreFeatures() {
    return new Features(this);
  }

  initCoreControls() {
    return new GMControl(this);
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

  isMapInstanceLoaded(map: AnyMapInstance) {
    return '_fullyLoaded' in map && map._fullyLoaded;
  }

  async init(map: MapInstanceWithGeoman) {
    this.mapAdapterInstance = await getMapAdapter(this, map);
    this.features.init();
    await this.addControls();
  }

  destroy(
    {
      removeSources,
    }: {
      removeSources: boolean;
    } = { removeSources: false },
  ) {
    this.removeControls();
    this.events.bus.detachAllEvents();

    if (removeSources) {
      for (const source of Object.values(this.features.sources)) {
        if (source) {
          source.remove();
        }
      }
    }

    if ('gm' in this.mapAdapter.mapInstance) {
      delete this.mapAdapter.mapInstance.gm;
    }
  }

  removeControls() {
    this.disableAllModes();
    this.mapAdapter.removeControl(this.control);
  }

  async onMapLoad() {
    if (this.loaded) {
      return;
    }

    await this.mapAdapter.loadImage({
      id: 'default-marker',
      image: defaultMarker,
    });

    this.events.fire(`${GM_PREFIX}:control`, {
      level: 'system',
      type: 'control',
      action: 'loaded',
    });
    this.loaded = true;
  }

  disableAllModes() {
    typedKeys(this.actionInstances).forEach((key) => {
      const [actionType, mode] = key.split('__');

      if (isActionType(actionType) && isModeName(mode)) {
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

  getGlobalLngLatBounds(): [LngLat, LngLat] {
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

  enableMode(actionType: ActionType, modeName: ModeName) {
    this.options.enableMode(actionType, modeName);
  }

  disableMode(actionType: ActionType, modeName: ModeName) {
    this.options.disableMode(actionType, modeName);
  }

  toggleMode(actionType: ActionType, modeName: ModeName) {
    this.options.toggleMode(actionType, modeName);
  }

  isModeEnabled(actionType: ActionType, modeName: ModeName) {
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
  const TIMEOUT = 60000;
  const geoman = new Geoman(map, options);

  await Promise.race([
    new Promise((resolve) => {
      geoman.mapAdapter.once(`${GM_PREFIX}:loaded`, resolve);
    }),
    new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`Timeout ${TIMEOUT / 1000} seconds: can't init geoman`)),
        TIMEOUT,
      );
    }),
  ]);

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
export { isGmControlEvent, isGmEvent, isGmModeEvent } from '@/utils/guards/events/index.ts';
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

export { GM_PREFIX } from '@/core/constants.ts';
export { DRAW_MODES } from '@/modes/constants.ts';
export { EXTRA_DRAW_MODES } from '@/modes/constants.ts';
export { SHAPE_NAMES } from '@/modes/constants.ts';
export { SOURCES } from '@/core/features/constants.ts';
export { FEATURE_ID_PROPERTY } from '@/core/features/constants.ts';
export { HELPER_MODES } from '@/modes/constants.ts';
export { EDIT_MODES } from '@/modes/constants.ts';
