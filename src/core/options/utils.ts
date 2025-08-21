import { cloneDeep, keyBy, countBy, merge, values } from 'lodash-es';

export const mergeByTypeCustomizer = (objValue: unknown, srcValue: unknown) => {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    const baseMap = keyBy(objValue, 'type');

    const countMap = countBy(srcValue, 'type');
    if (Object.values(countMap).some((count) => count > 1)) {
      throw new Error(
        'Multiple layers for the same shape are detected. ' +
        'Use "useDefaultLayers: false" and define layers manually.'
      );
    }

    srcValue.forEach(item => {
      if (baseMap[item.type]) {
        merge(baseMap[item.type], item);
      } else {
        baseMap[item.type] = cloneDeep(item);
      }
    });
    return values(baseMap);
  }

  return undefined;
};
