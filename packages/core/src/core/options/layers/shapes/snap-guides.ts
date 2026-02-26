import type { PartialLayerStyle } from '@/main.ts';

export const getSnapGuideStyles = (): Array<PartialLayerStyle> => {
  return [
    {
      type: 'line',
      paint: {
        'line-color': '#00979f',
        'line-width': 1.8,
        'line-dasharray': [2, 1],
      },
    },
  ];
};
