import { cloneDeep, keyBy, merge, values } from 'lodash-es';

export const mergeByTypeCustomizer = (objValue: unknown, srcValue: unknown) => {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    const baseMap = keyBy(objValue, 'type');

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
