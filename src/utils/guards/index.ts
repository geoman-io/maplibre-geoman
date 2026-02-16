import type { NonEmptyArray } from '@/types/index.ts';

export const isNonEmptyArray = <T>(arr: T[] | readonly T[]): arr is NonEmptyArray<T> => {
  return arr.length > 0;
};

export function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

// exports
export { isGmEvent } from '@/utils/guards/events/index.ts';
export { isModeName } from '@/utils/guards/modes.ts';
export { isHelperModeName } from '@/utils/guards/modes.ts';
export { isEditModeName } from '@/utils/guards/modes.ts';
export { isDrawModeName } from '@/utils/guards/modes.ts';
export { isActionType } from '@/utils/guards/modes.ts';
export { isMapPointerEvent } from '@/utils/guards/map.ts';
export { isMapWithOnceMethod } from '@/utils/guards/map.ts';
export { isBaseMapEventName } from '@/utils/guards/map.ts';
export { isPointerEventName } from '@/utils/guards/map.ts';
export { isGmModeEvent } from '@/utils/guards/events/mode.ts';
