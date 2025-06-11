import type { PartialLayerStyle, StyleVariables } from '@/main.ts';


export const getControlMarkerStyles = (
  styleVariables: StyleVariables,
): Array<PartialLayerStyle> => {
  return [
    {
      type: 'circle',
      paint: {
        'circle-radius': 7,
        'circle-color': '#ffffff',
        'circle-opacity': 1,
        'circle-stroke-color': styleVariables.lineColor,
        'circle-stroke-width': 2,
        'circle-stroke-opacity': 1,
      },
    },
  ];
};
