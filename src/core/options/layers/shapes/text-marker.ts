import type { PartialLayerStyle } from '@/main.ts';

export const getTextMarkerStyles = (): Array<PartialLayerStyle> => {
  return [
    {
      type: 'symbol',
      layout: {
        'text-field': ['get', 'text'],
        'text-justify': 'center',
      },
      paint: {
        'text-color': 'black',
        'text-halo-color': '#fff',
        'text-halo-width': 2,
      },
    },
  ];
};
