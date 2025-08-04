import type { GmOptionsData } from '@/types';
import type { PartialDeep } from 'type-fest';

export const layerStyles: PartialDeep<GmOptionsData['layerStyles']> = {
  polygon: {
    gm_main: [{
      type: 'line',
      paint: {
        'line-color': '#f00',
        'line-opacity': 0.9,
        'line-width': 3,
      },
    }, {
      type: 'fill',
      paint: {
        'fill-opacity': 1,
      },
    },
    ],
  },
};
