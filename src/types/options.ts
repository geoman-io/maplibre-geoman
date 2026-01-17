import defaultLayerStyles from '@/core/options/layers/style.ts';
import type { ModeName } from '@/types/controls.ts';
import type { BaseControlsPosition } from '@/types/map/index.ts';
import type {
  ActionOptions,
  ActionSettings,
  DrawModeName,
  EditModeName,
  HelperModeName,
} from '@/types/modes/index.ts';
import type { PartialDeep } from 'type-fest';

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
    useControlsUi: boolean;
    controlsPosition: BaseControlsPosition;
    controlsUiEnabledByDefault: boolean;
    controlsCollapsible: boolean;
    controlsStyles: ControlStyles;
    idGenerator: null | ((shapeGeoJson: GeoJsonShapeFeature) => string);
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
};
export type GmOptionsPartial = PartialDeep<GmOptionsData>;
export type GenericControlsOptions = {
  [key in ModeName]?: ControlOptions;
};
