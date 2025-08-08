import { defaultOptions } from '@/core/options/defaults/free.ts';
import type { GmOptionsData, ModeName } from '@/types/index.ts';
import { cloneDeep, set } from 'lodash-es';
import { forEachDeep } from '@/utils/collections.ts';


export const trackDefaultUiEnabledState = (options: GmOptionsData) => {
  const EXCLUDED_ACTIONS: ReadonlyArray<ModeName> = [
    'shape_markers',
  ];
  const defaultUiEnabled = options.settings.controlsUiEnabledByDefault;

  forEachDeep(options, (_, path) => {
    const modeName = path.at(2) as ModeName;

    if (path.length === 4 && path.at(-1) === 'uiEnabled') {
      if (EXCLUDED_ACTIONS.includes(modeName)) {
        return;
      }
      set(options, path, defaultUiEnabled);
    }
  });
};

export const getDefaultOptions = (): GmOptionsData => {
  return cloneDeep(defaultOptions);
};
