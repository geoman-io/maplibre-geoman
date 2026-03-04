import type { DrawModeName, EditModeName, HelperModeName } from '@/types/modes/index.ts';
import type { ModeName } from '@/types/controls.ts';
import type { ActionType, ModeType } from '@/types/options.ts';
import {
  ACTION_TYPES,
  DRAW_MODES,
  EDIT_MODES,
  HELPER_MODES,
  MODE_TYPES,
} from '@/modes/constants.ts';

export const isModeType = (name: string): name is ModeType => {
  return MODE_TYPES.includes(name as ModeType);
};

export const isActionType = (name: string): name is ActionType => {
  return ACTION_TYPES.includes(name as ActionType);
};

export const isDrawModeName = (name: string): name is DrawModeName => {
  return DRAW_MODES.includes(name as DrawModeName);
};

export const isEditModeName = (name: string): name is EditModeName => {
  return EDIT_MODES.includes(name as EditModeName);
};

export const isHelperModeName = (name: string): name is HelperModeName => {
  return HELPER_MODES.includes(name as HelperModeName);
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
