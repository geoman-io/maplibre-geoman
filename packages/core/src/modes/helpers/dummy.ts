import type { HelperModeName } from '@/types/modes/index.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';

export class DummyHelper extends BaseHelper {
  mode: HelperModeName = 'pin';
  eventHandlers = {};

  onStartAction() {
    throw new Error("DummyHelper: method onStartAction isn't implemented");
  }

  onEndAction() {
    throw new Error("DummyHelper: method onEndAction isn't implemented");
  }
}
