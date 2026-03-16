import type { PartialLayerStyle, StyleVariables } from '@/types/map/layers.ts';

export const getPolygonStyles = (styleVariables: StyleVariables): Array<PartialLayerStyle> => {
  return [
    {
      type: 'fill',
      paint: {
        'fill-color': styleVariables.fillColor,
        'fill-opacity': styleVariables.fillOpacity,
      },
    },
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
