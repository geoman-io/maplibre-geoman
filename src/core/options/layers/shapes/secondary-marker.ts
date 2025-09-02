import type { PartialLayerStyle, StyleVariables } from '@/main.ts';

export const getSecondaryControlMarkerStyles = (
  styleVariables: StyleVariables,
): Array<PartialLayerStyle> => {
  return [
    {
      type: 'circle',
      paint: {
        'circle-radius': 6,
        'circle-color': '#ffffff',
        'circle-opacity': 0.6,
        'circle-stroke-color': styleVariables.lineColor,
        'circle-stroke-width': 2,
        'circle-stroke-opacity': 1,
      },
    },
  ];
};
