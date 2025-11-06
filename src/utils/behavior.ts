import { IS_PRO } from '@/core/constants.ts';
import { LOAD_TIMEOUT } from '@/core/features/constants.ts';
import { typedKeys } from '@/utils/typing.ts';
import { debounce, throttle } from 'lodash-es';
import log from 'loglevel';

export function augmentIfPro<T>(value: readonly T[]): readonly T[];
export function augmentIfPro<T extends Record<PropertyKey, unknown>>(value: T): Partial<T>;
export function augmentIfPro(value: unknown) {
  if (!IS_PRO) {
    return Array.isArray(value) ? [] : {};
  }
  return value;
}

export const isTouchScreen = () => {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return true;
  }
  if (matchMedia('(hover: none)').matches) {
    return true;
  }
  return (
    'msMaxTouchPoints' in navigator &&
    typeof navigator.msMaxTouchPoints === 'number' &&
    navigator.msMaxTouchPoints > 0
  );
};

export const convertToThrottled = <T extends object>(
  methods: T,
  context: unknown,
  wait: number = 10,
) => {
  const throttledMethods: T = { ...methods };

  typedKeys(methods).forEach((key) => {
    const method = methods[key];
    if (typeof method === 'function') {
      throttledMethods[key] = throttle(method.bind(context), wait, {
        leading: true,
        trailing: false,
      }) as T[typeof key];
    } else {
      log.error('convertToThrottled: item is not a function', methods[key]);
    }
  });
  return throttledMethods;
};

export const convertToDebounced = <T extends object>(
  methods: T,
  context: unknown,
  wait: number = 10,
) => {
  const debouncedMethods: T = { ...methods };

  typedKeys(methods).forEach((key) => {
    const method = methods[key];
    if (typeof method === 'function') {
      debouncedMethods[key] = debounce(method.bind(context), wait, {
        leading: false,
        trailing: true,
      }) as T[typeof key];
    } else {
      log.error('convertToDebounced: item is not a function', methods[key]);
    }
  });
  return debouncedMethods;
};

export const withPromiseTimeoutRace = async (promise: Promise<unknown>, errorMessage?: string) => {
  const defaultErrorMessage = 'Promise race timeout';

  await Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(
        () =>
          reject(
            new Error(
              `Timeout ${LOAD_TIMEOUT / 1000} seconds: ${errorMessage || defaultErrorMessage}`,
            ),
          ),
        LOAD_TIMEOUT,
      );
    }),
  ]);
};
