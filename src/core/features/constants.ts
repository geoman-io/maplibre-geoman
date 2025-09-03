import { GM_PREFIX, IS_PRO } from '@/core/constants.ts';

export const FEATURE_PROPERTY_PREFIX = `__${GM_PREFIX}_` as const;
export const FEATURE_ID_PROPERTY = `${FEATURE_PROPERTY_PREFIX}id` as const;
export const FEATURE_SHAPE_PROPERTIES = ['center'] as const;

export const SOURCES: { [key: string]: string } = {
  // order matters here, layers order will be aligned according to these items
  ...(IS_PRO && { standby: `${GM_PREFIX}_standby` }), // available only in the pro version
  main: `${GM_PREFIX}_main`,
  temporary: `${GM_PREFIX}_temporary`,
} as const;
