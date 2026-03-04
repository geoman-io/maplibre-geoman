import type { HelperModeName } from '@/types/modes/index.ts';
import type { ActionType } from '@/types/options.ts';
import { BaseAction } from '@/modes/base-action.ts';

export abstract class BaseHelper extends BaseAction {
  actionType: ActionType = 'helper';
  abstract mode: HelperModeName;
}
