const UNIT_SYSTEMS = {
  imperial: 'en-US',
  metric: 'nb-NO',
} as const;

const UNITS = {
  distance: {
    metric: [
      { range: [0, 1], unit: 'cm', factor: 100 },
      { range: [1, 10000], unit: 'm', factor: 1 },
      { range: [10000, Infinity], unit: 'km', factor: 0.001 },
    ],
    imperial: [
      { range: [0, 0.3048], factor: 39.3701, unit: 'in' },
      { range: [0.3048, 1609.344], factor: 3.28084, unit: 'ft' },
      { range: [1609.344, Infinity], factor: 0.000621371, unit: 'mi' },
    ],
  },
  area: {
    metric: [
      { range: [0, 1], unit: 'cm²', factor: 10000 },
      { range: [1, 10000], unit: 'm²', factor: 1 },
      { range: [100000, Infinity], unit: 'km²', factor: 0.000001 },
    ],
    imperial: [
      { range: [0, 0.092903], factor: 1550.0031, unit: 'in²' },
      { range: [0.092903, 4046.856], factor: 10.7639, unit: 'ft²' },
      { range: [4046.856, 2_589_988], factor: 0.000247105, unit: 'ac' },
      { range: [2_589_988, Infinity], factor: 3.861e-7, unit: 'mi²' },
    ],
  },
} as const;

const IMPERIAL_REGIONS = new Set(['US', 'LR', 'MM', 'GB', 'UK', 'IE']);

export const isImperialByBrowser = () => {
  const loc = new Intl.Locale(navigator.language);
  return IMPERIAL_REGIONS.has(loc.region || '--');
}

type FormatOptions = {
  units: 'imperial' | 'metric',
  minimumFractionDigits?: number,
  maximumFractionDigits?: number,
};

export const toMod = (
  num: number,
  mod: number,
) => ((num % mod) + mod) % mod;

export const formatNumber = (
  num: number,
  options: FormatOptions,
): string => {
  return new Intl.NumberFormat(UNIT_SYSTEMS[options.units], {
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(num);
};

export const formatDistance = (
  num: number,
  options: FormatOptions,
): string => {
  const ranges = UNITS.distance[options.units];
  const range = ranges.find((item) => num >= item.range[0] && num < item.range[1]);

  if (range) {
    return `${formatNumber(num * range.factor, options)} ${range.unit}`;
  }

  return formatNumber(num, options);
};

export const formatArea = (
  num: number,
  options: FormatOptions,
): string => {
  const ranges = UNITS.area[options.units];
  const range = ranges.find((item) => num >= item.range[0] && num < item.range[1]);

  if (range) {
    return `${formatNumber(num * range.factor, options)} ${range.unit}`;
  }

  return formatNumber(num, options);
};
