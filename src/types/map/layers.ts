import type { SourcesStorage } from '@/types/features.ts';

export type StyleVariables = {
  lineColor: string;
  lineOpacity: number;
  lineWidth: number;
  fillColor: string;
  fillOpacity: number;
  circleMarkerRadius: number;
};

export interface PartialCircleLayer {
  type: 'circle';
  paint?: {
    'circle-radius'?: number;
    'circle-color'?: string;
    'circle-opacity'?: number;
    'circle-stroke-width'?: number;
    'circle-stroke-color'?: string;
    'circle-stroke-opacity'?: number;
  };
}

export interface PartialLineLayer {
  type: 'line';
  paint?: {
    'line-color'?: string;
    'line-width'?: number;
    'line-opacity'?: number;
    'line-dasharray'?: number[];
  };
  layout?: {
    'line-cap'?: 'butt' | 'round' | 'square';
    'line-join'?: 'bevel' | 'round' | 'miter';
  };
}

export interface PartialFillLayer {
  type: 'fill';
  paint?: {
    'fill-color'?: string;
    'fill-opacity'?: number;
    'fill-outline-color'?: string;
    'fill-antialias'?: boolean;
  };
}

export interface PartialSymbolLayer {
  type: 'symbol';
  layout?: {
    'icon-image'?: string;
    'icon-size'?: number;
    'icon-allow-overlap'?: boolean;
    'icon-anchor'?:
      | 'center'
      | 'left'
      | 'right'
      | 'top'
      | 'bottom'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right';
    'text-field'?: string[];
    'text-size'?: number;
    'text-justify'?: 'auto' | 'left' | 'center' | 'right';
    'text-anchor'?:
      | 'center'
      | 'left'
      | 'right'
      | 'top'
      | 'bottom'
      | 'top-left'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-right';
  };
  paint?: {
    'text-color'?: string;
    'text-opacity'?: number;
    'text-halo-color'?: string;
    'text-halo-width'?: number;
  };
}

export type PartialLayerStyle =
  | PartialLineLayer
  | PartialFillLayer
  | PartialCircleLayer
  | PartialSymbolLayer;

export type SourceStyles = Record<keyof SourcesStorage, StyleVariables>;

export type LayerStyle = Record<keyof SourcesStorage, Array<PartialLayerStyle>>;
