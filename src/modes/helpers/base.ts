import type { ActionType, HelperModeName } from '@/main.ts';
import { BaseAction } from '@/modes/base-action.ts';


export const helperModes = [
  'shape_markers',
  'pin',
  'snapping',
  'snap_guides',
  'measurements',
  'auto_trace',
  'geofencing',
  'zoom_to_features',
  'click_to_edit',
] as const;


export abstract class BaseHelper extends BaseAction {
  actionType: ActionType = 'helper';
  abstract mode: HelperModeName;
}
