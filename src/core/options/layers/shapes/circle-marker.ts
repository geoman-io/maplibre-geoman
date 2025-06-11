import type { PartialLayerStyle, StyleVariables } from '@/main.ts';


export const getCircleMarkerStyles = (
  styleVariables: StyleVariables,
): Array<PartialLayerStyle> => {
  return [
    {
      type: 'circle',
      paint: {
        'circle-radius': styleVariables.circleMarkerRadius,
        'circle-color': styleVariables.fillColor,
        'circle-opacity': styleVariables.fillOpacity,
        'circle-stroke-color': styleVariables.lineColor,
        'circle-stroke-width': styleVariables.lineWidth,
        'circle-stroke-opacity': styleVariables.lineOpacity,
      },
    },
  ];
};
