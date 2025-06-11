import type { PartialLayerStyle, StyleVariables } from '@/main.ts';


export const getLineStyles = (
  styleVariables: StyleVariables,
): Array<PartialLayerStyle> => {
  return [
    {
      type: 'line',
      paint: {
        'line-color': styleVariables.lineColor,
        'line-opacity': styleVariables.lineOpacity,
        'line-width': styleVariables.lineWidth,
      },
    },
  ];
};
