import { FeatureData } from '@/core/features/feature-data.ts';
import type { BaseDomMarker } from '@/core/map/base/marker.ts';
import { drawModes, extraDrawModes, shapeNames } from '@/modes/draw/base.ts';
import { createDrawInstance } from '@/modes/draw/index.ts';
import { editModes } from '@/modes/edit/base.ts';
import { createEditInstance } from '@/modes/edit/index.ts';
import { helperModes } from '@/modes/helpers/base.ts';
import { createHelperInstance } from '@/modes/helpers/index.ts';
import type { ModeName } from '@/types/controls.ts';
import type { PositionData } from '@/types/geojson.ts';
import type { ActionType } from '@/types/options.ts';

export type ActionInstanceKey = `${ActionType}__${ModeName}`;
export type ActionInstance = ReturnType<
  typeof createDrawInstance | typeof createEditInstance | typeof createHelperInstance
>;

export type ShapeName = typeof shapeNames[number];
export type DrawModeName = typeof drawModes[number];
export type ExtraDrawModeName = typeof extraDrawModes[number];
export type EditModeName = typeof editModes[number];
export type HelperModeName = typeof helperModes[number];

export type ChoiceItem = {
  title: string,
  value: boolean | string | number,
};

export type SelectActionOption = {
  type: 'select',
  label: string,
  value: ChoiceItem,
  choices: Array<ChoiceItem>,
};

export type ToggleActionOption = {
  type: 'toggle',
  label: string,
  value: boolean,
};

export type HiddenActionOption = {
  type: 'hidden',
  value: string | boolean | number | undefined,
};

export type SubAction = {
  label: string,
  method: () => void,
};

export type ActionOption = SelectActionOption | ToggleActionOption | HiddenActionOption;
export type ActionOptions = { [key: string]: ActionOption };
export type SubActions = { [key: string]: SubAction };


export type MarkerId = string;

export interface DomMarkerData {
  type: 'dom',
  instance: BaseDomMarker,
  position: PositionData,
}

export interface VertexMarkerData {
  type: 'vertex',
  instance: FeatureData,
  position: PositionData,
}

export interface CenterMarkerData {
  type: 'center',
  instance: FeatureData,
  position: PositionData,
}

export interface EdgeMarkerData {
  type: 'edge',
  instance: FeatureData,
  position: PositionData,
  segment: {
    start: PositionData,
    end: PositionData,
  },
}

export type MarkerData = DomMarkerData | VertexMarkerData | CenterMarkerData | EdgeMarkerData;

export type * from '@/types/modes/line-drawer.ts';
