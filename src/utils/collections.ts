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
