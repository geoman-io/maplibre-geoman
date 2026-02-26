type GeomanVersion = 'pro' | 'free';

let geomanVersion: GeomanVersion | null;
try {
  geomanVersion = __GEOMAN_VERSION__;
} catch {
  geomanVersion = (process.env.VITE_GEOMAN_VERSION as GeomanVersion) || null;
}

export const GM_PREFIX = 'gm' as const;
export const GM_SYSTEM_PREFIX = `_${GM_PREFIX}` as const;
export const IS_PRO = geomanVersion === 'pro';
