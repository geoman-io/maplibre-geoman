import { describe, expect, it, vi } from 'vitest';
import log from 'loglevel';
import { mergeByTypeCustomizer } from '@/core/options/utils.ts';

vi.mock('@/utils/guards/map.ts', () => ({
  isPartialLayer: (object: unknown) =>
    !!object &&
    typeof object === 'object' &&
    'type' in object &&
    ['symbol', 'fill', 'line', 'circle'].includes((object as { type: string }).type),
}));

describe('core/options/utils', () => {
  it('returns undefined when either value is not an array', () => {
    expect(mergeByTypeCustomizer({}, [])).toBeUndefined();
    expect(mergeByTypeCustomizer([], {})).toBeUndefined();
  });

  it('returns undefined and warns when source layers are invalid', () => {
    const warnSpy = vi.spyOn(log, 'warn').mockImplementation(() => undefined);

    const result = mergeByTypeCustomizer([{ type: 'line' }], [{ foo: 'bar' }]);

    expect(result).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith('Wrong partial layer detected for layer styles');
  });

  it('throws when duplicate layer types are provided in source', () => {
    expect(() =>
      mergeByTypeCustomizer([{ type: 'line' }], [{ type: 'line' }, { type: 'line' }]),
    ).toThrow('Multiple layers for the same shape are detected.');
  });

  it('merges existing types and appends new ones', () => {
    const baseLayers = [
      { type: 'line', paint: { 'line-width': 1 } },
      { type: 'fill', paint: { 'fill-opacity': 0.3 } },
    ];
    const sourceLayers = [
      { type: 'line', paint: { 'line-color': '#f00' } },
      { type: 'circle', paint: { 'circle-radius': 6 } },
    ];

    const result = mergeByTypeCustomizer(baseLayers, sourceLayers);

    expect(result).toHaveLength(3);
    expect(result?.find((item) => item.type === 'line')).toMatchObject({
      type: 'line',
      paint: {
        'line-width': 1,
        'line-color': '#f00',
      },
    });
    expect(result?.find((item) => item.type === 'circle')).toMatchObject({
      type: 'circle',
      paint: {
        'circle-radius': 6,
      },
    });
  });
});
