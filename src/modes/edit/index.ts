import type { EditModeName, Geoman } from '@/main.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { EditChange } from '@/modes/edit/change.ts';
import { EditCut } from '@/modes/edit/cut.ts';
import { EditDelete } from '@/modes/edit/delete.ts';
import { EditDrag } from '@/modes/edit/drag.ts';
import { EditRotate } from '@/modes/edit/rotate.ts';
import log from 'loglevel';


type EditClassConstructor = new (gm: Geoman) => BaseEdit;
type EditClassMap = {
  [K in EditModeName]: EditClassConstructor | null;
};

export const editClassMap: EditClassMap = {
  drag: EditDrag,
  change: EditChange,
  rotate: EditRotate,
  scale: null,
  copy: null,
  cut: EditCut,
  split: null,
  union: null,
  difference: null,
  line_simplification: null,
  lasso: null,
  delete: EditDelete,
} as const;

export const createEditInstance = (gm: Geoman, mode: EditModeName) => {
  if (editClassMap[mode]) {
    return new editClassMap[mode](gm);
  }

  log.error(`Edit "${mode}" is not available`);
  return null;
};
