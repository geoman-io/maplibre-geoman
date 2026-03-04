import { systemControls } from '@/core/controls/defaults.ts';
import { getDefaultOptions } from '@/core/options/defaults/index.ts';
import type { SystemControls } from '@/types/controls.ts';
import type { GmOptionsData } from '@/types/options.ts';
import { cloneDeep } from 'lodash-es';
import { writable } from 'svelte/store';

const initialState: {
  controls: SystemControls;
  options: GmOptionsData['controls'];
  settings: GmOptionsData['settings'];
} = {
  controls: cloneDeep(systemControls),
  options: getDefaultOptions().controls,
  settings: getDefaultOptions().settings,
};

export const controlsStore = writable(initialState);
