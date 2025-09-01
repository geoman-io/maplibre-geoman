import type { ActionType, HelperModeName } from '@/main.ts';
import { BaseAction } from '@/modes/base-action.ts';

export abstract class BaseHelper extends BaseAction {
  actionType: ActionType = 'helper';
  abstract mode: HelperModeName;
}
