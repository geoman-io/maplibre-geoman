import type { PartialLayerStyle } from '@/main.ts';
import { FEATURE_PROPERTY_PREFIX } from '@/core/features/constants.ts';

export const getTextMarkerStyles = (): Array<PartialLayerStyle> => {
  return [
    {
      type: 'symbol',
      layout: {
        'text-field': ['get', `${FEATURE_PROPERTY_PREFIX}text`],
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
