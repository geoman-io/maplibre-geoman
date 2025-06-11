import type { ActionType, DrawModeName, EditModeName, HelperModeName, ModeName } from '@/main.ts';
import { actionTypes } from '@/modes/base-action.ts';
import { drawModes } from '@/modes/draw/base.ts';
import { editModes } from '@/modes/edit/base.ts';
import { helperModes } from '@/modes/helpers/base.ts';


export const isActionType = (name: string): name is ActionType => {
  return actionTypes.includes(name as ActionType);
};

export const isDrawModeName = (name: string): name is DrawModeName => {
  return drawModes.includes(name as DrawModeName);
};

export const isEditModeName = (name: string): name is EditModeName => {
  return editModes.includes(name as EditModeName);
};

export const isHelperModeName = (name: string): name is HelperModeName => {
  return helperModes.includes(name as HelperModeName);
};

export const isModeName = (name: string): name is ModeName => {
  return isDrawModeName(name) || isEditModeName(name) || isHelperModeName(name);
};

export { isGmDrawFreehandDrawerEvent } from '@/utils/guards/events/draw.ts';
export { isGmDrawLineDrawerEvent } from '@/utils/guards/events/draw.ts';
export { isGmDrawShapeEvent } from '@/utils/guards/events/draw.ts';
export { isGmDrawEvent } from '@/utils/guards/events/draw.ts';
export { isGmGeofencingViolationEvent } from '@/utils/guards/events/helper.ts';
export { isGmHelperEvent } from '@/utils/guards/events/helper.ts';
export { isGmEditEvent } from '@/utils/guards/events/edit.ts';
