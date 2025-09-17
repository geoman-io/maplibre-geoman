import { isPartialLayer } from '@/utils/guards/map.ts';
import { cloneDeep, countBy, keyBy, merge, values } from 'lodash-es';
import log from 'loglevel';

export const mergeByTypeCustomizer = (objValue: unknown, srcValue: unknown) => {
  if (!Array.isArray(objValue) || !Array.isArray(srcValue)) {
    return undefined;
  }

  if (srcValue.some((item) => !isPartialLayer(item))) {
    log.warn('Wrong partial layer detected for layer styles');
    return undefined;
  }

  const baseMap = keyBy(objValue, 'type');

  const countMap = countBy(srcValue, 'type');
  if (Object.values(countMap).some((count) => count > 1)) {
    throw new Error(
      'Multiple layers for the same shape are detected. ' +
        'Use "useDefaultLayers: false" and define layers manually.',
    );
  }

  srcValue.forEach((item) => {
    if (baseMap[item.type]) {
      merge(baseMap[item.type], item);
    } else {
      baseMap[item.type] = cloneDeep(item);
    }
  });
  return values(baseMap);
};
