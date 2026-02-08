import { isPlainObject } from 'lodash-es';
import log from 'loglevel';

export const findInCollection = <T>(
  collection: Map<unknown, T> | Set<T> | Array<T>,
  callback: (item: T) => boolean,
): T | null => {
  let targetItem: T | null = null;

  try {
    collection.forEach((item: T) => {
      if (callback(item)) {
        targetItem = item;
        throw new Error('found');
      }
    });
  } catch {
    // no action required
  }

  return targetItem;
};

type Path = ReadonlyArray<string | number>;

export function forEachDeep(
  item: unknown,
  iteratee: (value: unknown, path: Path) => void,
  path: Path = [],
): void {
  iteratee(item, path);

  if (Array.isArray(item)) {
    item.forEach((value, index) => forEachDeep(value, iteratee, [...path, index]));
  } else if (isPlainObject(item)) {
    Object.entries(item as Record<string, unknown>).forEach(([key, value]) =>
      forEachDeep(value, iteratee, [...path, key]),
    );
  } else if (item !== null && typeof item === 'object') {
    log.warn(`forEachDeep: unknown collection type (${item}), path "${path.join('.')}"`);
  }
}

export const dedupeById = <T extends { id: unknown }>(items: Array<T>): Array<T> => {
  const seen = new Map<unknown, T>();
  items.forEach((item) => {
    if (!seen.has(item.id)) {
      seen.set(item.id, item);
    }
  });
  return Array.from(seen.values());
};
