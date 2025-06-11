import { defaultOptions } from '@/core/options/defaults/free.ts';
import type { GmOptionsData } from '@/types/index.ts';
import { cloneDeep } from 'lodash-es';


export const getDefaultOptions = (): GmOptionsData => {
  return cloneDeep(defaultOptions);
};
