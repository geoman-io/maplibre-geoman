import { systemControls } from '@/core/controls/defaults.ts';
import { getDefaultOptions } from '@/core/options/defaults/index.ts';
import type { CustomControl, SystemControls } from '@/types/controls.ts';
import type { GmOptionsData } from '@/types/options.ts';
import { cloneDeep } from 'lodash-es';
import { writable } from 'svelte/store';

const initialState: {
  controls: SystemControls;
  // host-defined buttons rendered as an extra group below the built-in controls
  customControls: Array<CustomControl>;
  options: GmOptionsData['controls'];
  settings: GmOptionsData['settings'];
} = {
  controls: cloneDeep(systemControls),
  customControls: [],
  options: getDefaultOptions().controls,
  settings: getDefaultOptions().settings,
};

export const controlsStore = writable(initialState);
