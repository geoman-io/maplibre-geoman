import { describe, expect, it } from 'vitest';
import { ALL_SHAPE_NAMES } from '@/modes/constants.ts';
import { propertyValidators } from '@/core/features/validators.ts';

describe('core/features/propertyValidators', () => {
  it('validates id values', () => {
    expect(propertyValidators.id('feature-1')).toBe(true);
    expect(propertyValidators.id(7)).toBe(true);
    expect(propertyValidators.id(null)).toBe(false);
  });

  it('validates shape values against known shape names', () => {
    expect(propertyValidators.shape(ALL_SHAPE_NAMES[0])).toBe(true);
    expect(propertyValidators.shape('not-a-shape')).toBe(false);
  });

  it('validates lng/lat center tuples', () => {
    expect(propertyValidators.center([12.5, 55.7])).toBe(true);
    expect(propertyValidators.center([12.5])).toBe(false);
    expect(propertyValidators.center(['12.5', 55.7])).toBe(false);
  });

  it('validates boolean flags', () => {
    expect(propertyValidators.disableEdit(true)).toBe(true);
    expect(propertyValidators.disableEdit(false)).toBe(true);
    expect(propertyValidators.disableEdit('true')).toBe(false);
  });
});
