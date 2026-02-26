import { describe, expect, it } from 'vitest';
import { SOURCES } from '@/core/features/constants.ts';
import { isFeatureSourceName } from '@/utils/guards/features.ts';

describe('utils/guards/features', () => {
  it('matches known feature source names only', () => {
    const knownSourceNames = Object.values(SOURCES);

    expect(knownSourceNames.every((name) => isFeatureSourceName(name))).toBe(true);
    expect(isFeatureSourceName('gm_unknown')).toBe(false);
  });
});
