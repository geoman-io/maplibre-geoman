import { describe, expect, it } from 'vitest';
import { includesWithType, typedKeys, typedValues } from '@/utils/typing.ts';

describe('utils/typing', () => {
  it('returns object keys and values in a typed-safe way', () => {
    const data = { alpha: 1, beta: 2 } as const;

    expect(typedKeys(data)).toEqual(['alpha', 'beta']);
    expect(typedValues(data)).toEqual([1, 2]);
  });

  it('checks membership against a readonly string array', () => {
    const allowed = ['polygon', 'line'] as const;

    expect(includesWithType('polygon', allowed)).toBe(true);
    expect(includesWithType('circle', allowed)).toBe(false);
  });
});
