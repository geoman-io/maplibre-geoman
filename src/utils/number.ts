export const toMod = (
  num: number,
  mod: number,
) => ((num % mod) + mod) % mod;

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('nb-NO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDistance = (num: number): string => {
  type Range = {
    range: [number, number];
    factor: number,
    unit: string;
  };

  const ranges: Array<Range> = [
    { range: [0, 1], unit: 'cm', factor: 100 },
    { range: [1, 10000], unit: 'm', factor: 1 },
    { range: [10000, Infinity], unit: 'km', factor: 0.001 },
  ];

  const range = ranges.find((item) => num >= item.range[0] && num < item.range[1]);
  if (range) {
    return `${formatNumber(num * range.factor)} ${range.unit}`;
  }

  return formatNumber(num);
};

export const formatArea = (num: number): string => {
  type Range = {
    range: [number, number];
    factor: number,
    unit: string;
  };

  const ranges: Array<Range> = [
    { range: [0, 1], unit: 'cm²', factor: 10000 },
    { range: [1, 10000], unit: 'm²', factor: 1 },
    { range: [100000, Infinity], unit: 'km²', factor: 0.000001 },
  ];

  const range = ranges.find((item) => num >= item.range[0] && num < item.range[1]);
  if (range) {
    return `${formatNumber(num * range.factor)} ${range.unit}`;
  }

  return formatNumber(num);
};
