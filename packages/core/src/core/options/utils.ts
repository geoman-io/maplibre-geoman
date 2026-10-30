import { isPartialLayer } from '@/utils/guards/map.ts';
import { cloneDeep, countBy, keyBy, mergeWith, values } from 'lodash-es';
import log from 'loglevel';

// paint/layout values and expressions are arrays; a user-provided array must
// replace the default instead of being merged with it index-wise
const replaceArraysCustomizer = (_objValue: unknown, srcValue: unknown) => {
  if (Array.isArray(srcValue)) {
    return srcValue;
  }
  return undefined;
};

const isLayerList = (value: unknown[]): boolean => value.length > 0 && value.every(isPartialLayer);

export const mergeByTypeCustomizer = (objValue: unknown, srcValue: unknown) => {
  if (!Array.isArray(objValue) || !Array.isArray(srcValue)) {
    return undefined;
  }

  // The layer-style merge (by `type`) must not run for other arrays, such as
  // keyboard bindings. An empty array used to keep the last default item, and a
  // non-empty one was merged index by index (#255). Replace those outright.
  if (!isLayerList(objValue) && !isLayerList(srcValue)) {
    return cloneDeep(srcValue);
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
      mergeWith(baseMap[item.type], item, replaceArraysCustomizer);
    } else {
      baseMap[item.type] = cloneDeep(item);
    }
  });
  return values(baseMap);
};
