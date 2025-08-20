import defaultLayerStyles from '@/core/options/layers/style.ts';
import { actionTypes } from '@/modes/base-action.ts';
import type { ModeName } from '@/types/controls.ts';
import type { BaseControlsPosition } from '@/types/map/index.ts';
import type { ActionOptions, ActionSettings, DrawModeName, EditModeName, HelperModeName } from '@/types/modes/index.ts';
import type { PartialDeep } from 'type-fest';


export type ActionType = typeof actionTypes[number];

export interface ControlOptions {
  title: string,
  icon: string | null,
  uiEnabled: boolean,
  active: boolean,
  options?: ActionOptions,
  settings?: ActionSettings,
}

export interface ControlStyles {
  controlGroupClass: string,
  controlContainerClass: string,
  controlButtonClass: string,
}

export type GmOptionsData = {
  settings: {
    mergeDiff: boolean;
    throttlingDelay: number,
    useDefaultLayers: boolean,
    controlsPosition: BaseControlsPosition,
    controlsUiEnabledByDefault: boolean,
    controlsCollapsible: boolean,
    controlsStyles: ControlStyles,
  },
  layerStyles: typeof defaultLayerStyles,
  controls: {
    draw: { [key in DrawModeName]?: ControlOptions },
    edit: { [key in EditModeName]?: ControlOptions },
    helper: { [key in HelperModeName]?: ControlOptions },
  }
};
export type GmOptionsPartial = PartialDeep<GmOptionsData>;
export type GenericControlsOptions = {
  [key in ModeName]?: ControlOptions
};
