import { FeatureData } from '@/core/features/feature-data.ts';
import type { BaseDomMarker } from '@/core/map/base/marker.ts';
import { drawModes, extraDrawModes, shapeNames } from '@/modes/draw/base.ts';
import { editModes } from '@/modes/edit/base.ts';
import { helperModes } from '@/modes/helpers/base.ts';
import type { ModeName } from '@/types/controls.ts';
import type { PositionData } from '@/types/geojson.ts';
import type { ActionType } from '@/types/options.ts';
import type { Geoman } from '@/main.ts';

export type ActionInstanceKey = `${ActionType}__${ModeName}`;
export type ActionInstance = ReturnType<
  Geoman['createDrawInstance'] | Geoman['createEditInstance'] | Geoman['createHelperInstance']
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
  name: string,
  value: ChoiceItem,
  choices: Array<ChoiceItem>,
};

export type ToggleActionOption = {
  type: 'toggle',
  label: string,
  name: string,
  value: boolean,
};

export type SubAction = {
  label: string,
  name: string,
  method: () => void,
};

export type ActionOption = SelectActionOption | ToggleActionOption;
export type ActionOptions = Array<ActionOption>;
export type SubActions = Array<SubAction>;


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
