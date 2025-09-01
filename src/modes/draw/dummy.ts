import type { DrawModeName, Geoman } from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';

export class DummyDraw extends BaseDraw {
  mode: DrawModeName = 'marker';
  eventHandlers = {};

  constructor(gm: Geoman) {
    super(gm);
    this.featureData = null;
  }

  onStartAction() {
    throw new Error("DummyDraw: method onStartAction isn't implemented");
  }

  onEndAction() {
    throw new Error("DummyDraw: method onEndAction isn't implemented");
  }
}
