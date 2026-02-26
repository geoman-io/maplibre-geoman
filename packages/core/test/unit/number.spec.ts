import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  formatArea,
  formatDistance,
  formatNumber,
  isImperialByBrowser,
  toMod,
} from '@/utils/number.ts';

describe('utils/number', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('normalizes negative modulo values', () => {
    expect(toMod(-1, 360)).toBe(359);
    expect(toMod(721, 360)).toBe(1);
  });

  it('formats numbers with explicit decimal precision settings', () => {
    expect(
      formatNumber(12.3456, {
        units: 'imperial',
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }),
    ).toBe('12.346');
  });

  it('formats distances with the expected unit buckets', () => {
    expect(formatDistance(0.5, { units: 'metric' })).toContain('cm');
    expect(formatDistance(20, { units: 'metric' })).toContain('m');
    expect(formatDistance(20_000, { units: 'metric' })).toContain('km');
    expect(formatDistance(1_000, { units: 'imperial' })).toContain('ft');
    expect(formatDistance(5_000, { units: 'imperial' })).toContain('mi');
    expect(formatDistance(-5, { units: 'imperial' })).toBe('-5');
  });

  it('formats areas with the expected unit buckets', () => {
    expect(formatArea(0.5, { units: 'metric' })).toContain('cm²');
    expect(formatArea(50, { units: 'metric' })).toContain('m²');
    expect(formatArea(2_000_000, { units: 'metric' })).toContain('km²');
    expect(formatArea(0.05, { units: 'imperial' })).toContain('in²');
    expect(formatArea(1_000, { units: 'imperial' })).toContain('ft²');
    expect(formatArea(10_000, { units: 'imperial' })).toContain('ac');
    expect(formatArea(-5, { units: 'imperial' })).toBe('-5');
  });

  it('detects imperial unit regions from the browser locale', () => {
    vi.stubGlobal('navigator', { language: 'en-US' });
    expect(isImperialByBrowser()).toBe(true);

    vi.stubGlobal('navigator', { language: 'fr-FR' });
    expect(isImperialByBrowser()).toBe(false);
  });
});
