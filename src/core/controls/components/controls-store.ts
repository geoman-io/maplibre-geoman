import { systemControls } from '@/core/controls/defaults.ts';
import { getDefaultOptions } from '@/core/options/defaults/index.ts';
import type { GmOptionsData, SystemControls } from '@/main.ts';
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
