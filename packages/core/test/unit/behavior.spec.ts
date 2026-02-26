import { afterEach, describe, expect, it, vi } from 'vitest';
import log from 'loglevel';
import { IS_PRO } from '@/core/constants.ts';
import { augmentIfPro, withPromiseTimeoutRace } from '@/utils/behavior.ts';

describe('utils/behavior', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('augments values based on the build variant', () => {
    const inputArray = [1, 2, 3] as const;
    const inputObject = { a: 1, b: 2 };

    if (IS_PRO) {
      expect(augmentIfPro(inputArray)).toBe(inputArray);
      expect(augmentIfPro(inputObject)).toBe(inputObject);
    } else {
      expect(augmentIfPro(inputArray)).toEqual([]);
      expect(augmentIfPro(inputObject)).toEqual({});
    }
  });

  it('resolves when the source promise settles before timeout', async () => {
    await expect(
      withPromiseTimeoutRace({
        promise: Promise.resolve('done'),
        timeout: 20,
      }),
    ).resolves.toBeUndefined();
  });

  it('rejects with timeout error and calls onTimeout', async () => {
    vi.useFakeTimers();
    const onTimeout = vi.fn();

    const timeoutPromise = withPromiseTimeoutRace({
      promise: new Promise(() => undefined),
      errorMessage: 'Custom timeout',
      timeout: 10,
      onTimeout,
    });
    const expectation = expect(timeoutPromise).rejects.toThrow(
      'Timeout 0.01 seconds: Custom timeout',
    );

    await vi.advanceTimersByTimeAsync(10);

    await expectation;
    expect(onTimeout).toHaveBeenCalledOnce();
  });

  it('logs callback errors during timeout cleanup', async () => {
    vi.useFakeTimers();
    const callbackError = new Error('cleanup failed');
    const errorSpy = vi.spyOn(log, 'error').mockImplementation(() => undefined);

    const timeoutPromise = withPromiseTimeoutRace({
      promise: new Promise(() => undefined),
      timeout: 5,
      onTimeout: () => {
        throw callbackError;
      },
    });
    const expectation = expect(timeoutPromise).rejects.toThrow(
      'Timeout 0.005 seconds: Promise race timeout',
    );

    await vi.advanceTimersByTimeAsync(5);

    await expectation;
    expect(errorSpy).toHaveBeenCalledWith(
      'withPromiseTimeoutRace onTimeout callback failed',
      callbackError,
    );
  });
});
