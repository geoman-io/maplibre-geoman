import { describe, expect, it, vi } from 'vitest';
import log from 'loglevel';
import { findInCollection, forEachDeep } from '@/utils/collections.ts';

describe('utils/collections', () => {
  it('finds matching items in arrays, sets, and maps', () => {
    expect(findInCollection([1, 2, 3], (item) => item === 2)).toBe(2);
    expect(findInCollection(new Set([1, 2, 3]), (item) => item === 3)).toBe(3);
    expect(
      findInCollection(
        new Map<string, number>([
          ['a', 1],
          ['b', 2],
        ]),
        (item) => item === 1,
      ),
    ).toBe(1);
  });

  it('returns null when no item matches', () => {
    expect(findInCollection([1, 2, 3], (item) => item === 9)).toBeNull();
  });

  it('walks nested arrays and objects with full paths', () => {
    const visited: Array<{ value: unknown; path: ReadonlyArray<string | number> }> = [];
    const data = {
      shape: {
        coords: [10, 20],
      },
    };

    forEachDeep(data, (value, path) => {
      visited.push({ value, path });
    });

    expect(visited[0]).toEqual({ value: data, path: [] });
    expect(visited).toContainEqual({ value: data.shape, path: ['shape'] });
    expect(visited).toContainEqual({ value: data.shape.coords, path: ['shape', 'coords'] });
    expect(visited).toContainEqual({ value: 10, path: ['shape', 'coords', 0] });
    expect(visited).toContainEqual({ value: 20, path: ['shape', 'coords', 1] });
  });

  it('warns for unknown object collection types', () => {
    const warnSpy = vi.spyOn(log, 'warn').mockImplementation(() => undefined);

    forEachDeep(new Date(), () => undefined);

    expect(warnSpy).toHaveBeenCalledOnce();
  });
});
