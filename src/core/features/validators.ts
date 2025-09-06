import type { FeatureId, FeatureShape, FeatureShapeProperties, LngLat } from '@/types';
import { includesWithType } from '@/utils/typing.ts';
import { ALL_SHAPE_NAMES } from '@/modes/constants.ts';
import { isLngLat } from '@/utils/guards/geojson.ts';

import type { PropertyValidator } from '@/types/utils.ts';

export const propertyValidators: {
  [K in keyof FeatureShapeProperties]: PropertyValidator<NonNullable<FeatureShapeProperties[K]>>;
} = {
  id: (value: unknown): value is FeatureId =>
    typeof value === 'string' || typeof value === 'number',

  shape: (value: unknown): value is FeatureShape =>
    typeof value === 'string' && includesWithType(value, ALL_SHAPE_NAMES),

  center: (value: unknown): value is LngLat => isLngLat(value),

  text: (value: unknown): value is string => typeof value === 'string',
};
