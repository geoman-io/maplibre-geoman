import type { Geoman } from '@/main.ts';

export abstract class BaseControl {
  gm: Geoman;

  constructor(gm: Geoman) {
    this.gm = gm;
  }

  abstract onAdd(): HTMLElement;

  abstract onRemove(): void;
}
