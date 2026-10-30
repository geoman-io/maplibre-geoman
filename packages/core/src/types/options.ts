import defaultLayerStyles from '@/core/options/layers/style.ts';
import type { CustomControl, ModeName } from '@/types/controls.ts';
import type { BaseControlsPosition } from '@/types/map/index.ts';
import type {
  ActionOptions,
  ActionSettings,
  DrawModeName,
  EditModeName,
  HelperModeName,
} from '@/types/modes/index.ts';
import type { PartialDeep } from 'type-fest';
import type { Geometry } from 'geojson';

import { ACTION_TYPES, MODE_TYPES } from '@/modes/constants.ts';
import type { GeoJsonShapeFeature } from './geojson';

export type ModeType = (typeof MODE_TYPES)[number];
export type ActionType = (typeof ACTION_TYPES)[number];

export interface ControlOptions {
  title: string;
  icon: string | null;
  uiEnabled: boolean;
  active: boolean;
  options?: ActionOptions;
  settings?: ActionSettings;
  order?: number;
}

export interface ControlStyles {
  controlGroupClass: string;
  controlContainerClass: string;
  controlButtonClass: string;
}

export type GmOptionsData = {
  settings: {
    throttlingDelay: number;
    /**
     * When true, events like gm:create and gm:remove will wait for MapLibre
     * to commit data updates before firing. This ensures feature data is
     * accessible in event handlers via exportGeoJson().
     *
     * Set to false for faster async updates if you don't need immediate
     * data consistency in event handlers.
     *
     * @default true
     */
    awaitDataUpdatesOnEvents: boolean;
    useDefaultLayers: boolean;
    useCursorHandlers: boolean;
    useControlsUi: boolean;
    controlsPosition: BaseControlsPosition;
    controlsUiEnabledByDefault: boolean;
    controlsCollapsible: boolean;
    controlsStyles: ControlStyles;
    idGenerator: null | ((shapeGeoJson: GeoJsonShapeFeature) => string);
    /**
     * The snapping tolerance in pixels. When the cursor is within this distance
     * of a snappable point or line, snapping will activate.
     *
     * @default 18
     */
    snapDistance: number;
    /**
     * What to do when a drawn polygon ring crosses itself.
     * `split` (default) unkinks it into a MultiPolygon, as previous releases did.
     * `reject` refuses the ring, fires `gm:draw:rejected`, and leaves drawing open.
     *
     * @default 'split'
     */
    polygonSelfIntersection?: 'split' | 'reject';
    /**
     * When a finished polygon has a single part, store it as a Polygon instead of
     * a one-part MultiPolygon. Default `false` keeps the historical MultiPolygon
     * so existing callers are unchanged.
     *
     * @default false
     */
    polygonAsPolygon?: boolean;
    /**
     * Veto a create, update, or removal before it is written. Covers mouse,
     * keyboard, and API paths that go through the before-create / before-update
     * checks, vertex insertion and removal, and (in Pro) `deleteAndNotify` /
     * `edit.setGeometry`. Return `false` to refuse the change. A throw is also
     * treated as a refusal.
     *
     * `featureId` is null when a create has not yet produced a feature.
     * `geometry` is the candidate geometry, or null for a removal.
     */
    beforeChange?: (context: {
      operation: 'create' | 'update' | 'remove';
      featureId: string | number | null;
      geometry: Geometry | null;
    }) => boolean | Promise<boolean>;
    markerIcons: {
      default: string;
      control: string;
    };
  };
  layerStyles: typeof defaultLayerStyles;
  controls: {
    draw: { [key in DrawModeName]?: ControlOptions };
    edit: { [key in EditModeName]?: ControlOptions };
    helper: { [key in HelperModeName]?: ControlOptions };
  };
  /**
   * Host-defined control-bar buttons rendered as an extra group below the
   * built-in controls. Each runs its own `onClick` handler instead of toggling
   * a mode. Can also be managed at run time via
   * `gm.control.addCustomControl()` / `removeCustomControl()`.
   */
  customControls?: Array<CustomControl>;
};
export type GmOptionsPartial = PartialDeep<GmOptionsData>;
export type GenericControlsOptions = {
  [key in ModeName]?: ControlOptions;
};
