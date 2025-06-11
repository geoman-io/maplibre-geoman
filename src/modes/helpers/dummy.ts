import type { HelperModeName } from '@/main.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';

export class DummyHelper extends BaseHelper {
  mode: HelperModeName = 'pin';
  mapEventHandlers = {};

  onStartAction() {
    throw new Error('DummyHelper: method onStartAction isn\'t implemented');
  }

  onEndAction() {
    throw new Error('DummyHelper: method onEndAction isn\'t implemented');
  }
}
