import { describe, expect, it, vi } from 'vitest';
import log from 'loglevel';
import { allowBeforeChange } from '@/core/before-change.ts';

const gmWith = (beforeChange?: (context: unknown) => unknown) =>
  ({
    options: { settings: { beforeChange } },
  }) as never;

describe('allowBeforeChange', () => {
  it('allows the change when no hook is set', async () => {
    await expect(
      allowBeforeChange(gmWith(), { operation: 'remove', featureId: 'a', geometry: null }),
    ).resolves.toBe(true);
  });

  it('refuses when the hook returns false or throws', async () => {
    const hook = vi.fn(() => false);
    await expect(
      allowBeforeChange(gmWith(hook), {
        operation: 'update',
        featureId: 'a',
        geometry: { type: 'Point', coordinates: [0, 0] },
      }),
    ).resolves.toBe(false);
    expect(hook).toHaveBeenCalledWith({
      operation: 'update',
      featureId: 'a',
      geometry: { type: 'Point', coordinates: [0, 0] },
    });

    vi.spyOn(log, 'error').mockImplementation(() => undefined);
    await expect(
      allowBeforeChange(
        gmWith(() => {
          throw new Error('no');
        }),
        { operation: 'create', featureId: null, geometry: null },
      ),
    ).resolves.toBe(false);
  });
});
