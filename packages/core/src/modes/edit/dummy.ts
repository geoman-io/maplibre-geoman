import type { EditModeName } from '@/main.ts';
import { BaseEdit } from '@/modes/edit/base.ts';

export class DummyEdit extends BaseEdit {
  mode: EditModeName = 'drag';
  eventHandlers = {};
  featureData = null;

  // constructor(gm: Geoman) {
  //   super(gm);
  // }

  onStartAction() {
    throw new Error("DummyEdit: method onStartAction isn't implemented");
  }

  onEndAction() {
    throw new Error("DummyEdit: method onEndAction isn't implemented");
  }
}
