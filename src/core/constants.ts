import type { Options } from '../../vite.config.ts';

let geomanVersion: Options['GmVersion'] | null;
try {
  geomanVersion = __GEOMAN_VERSION__;
} catch {
  geomanVersion = (process.env.VITE_GEOMAN_VERSION as Options['GmVersion']) || null;
}

export const GM_PREFIX = 'gm' as const;
export const IS_PRO = geomanVersion === 'pro';
