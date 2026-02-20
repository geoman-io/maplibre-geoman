import { SOURCES } from '@/core/features/constants.ts';
import type { FeatureSourceName } from '@/types';

export const isFeatureSourceName = (name: string): name is FeatureSourceName => {
  return (Object.values(SOURCES) as Array<string>).includes(name);
};
