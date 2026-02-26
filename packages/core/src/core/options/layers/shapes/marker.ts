import type { PartialLayerStyle } from '@/main.ts';

export const getMarkerStyles = (): Array<PartialLayerStyle> => {
  return [
    {
      type: 'symbol',
      layout: {
        'icon-image': 'default-marker',
        'icon-size': 0.18,
        'icon-allow-overlap': true,
        'icon-anchor': 'bottom',
      },
    },
  ];
};
