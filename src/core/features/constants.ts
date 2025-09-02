import { GM_PREFIX, IS_PRO } from '@/core/constants.ts';

export const FEATURE_ID_PROPERTY = '__gmid' as const;
export const SOURCES: { [key: string]: string } = {
  // order matters here, layers order will be aligned according to these items
  ...(IS_PRO && { standby: `${GM_PREFIX}_standby` }), // available only in the pro version
  main: `${GM_PREFIX}_main`,
  temporary: `${GM_PREFIX}_temporary`,
} as const;
