import { GM_PREFIX, IS_PRO } from '../constants.ts';

export const FEATURE_PROPERTY_PREFIX = `__${GM_PREFIX}_` as const;
export const FEATURE_ID_PROPERTY = `${FEATURE_PROPERTY_PREFIX}id` as const;
export const LOAD_TIMEOUT = 60000;

const SOURCE_NAMES = [
  // order matters here, layers order will be aligned according to these items
  'standby',
  'main',
  'temporary',
  'internal',
] as const;

type SourceName = (typeof SOURCE_NAMES)[number];
type SourcesMap = { readonly [K in SourceName]: `${typeof GM_PREFIX}_${K}` };

export const SOURCES = Object.fromEntries(
  SOURCE_NAMES.filter((name) => name !== 'standby' || IS_PRO).map((name) => [
    name,
    `${GM_PREFIX}_${name}`,
  ]),
) as SourcesMap;
