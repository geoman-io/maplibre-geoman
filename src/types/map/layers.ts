import type { SourcesStorage } from '@/types/features.ts';
import type {
  PartialCircleLayer,
  PartialLineLayer,
  PartialFillLayer,
  PartialSymbolLayer,
} from '@mapLib/types/layers.ts';

export type { PartialCircleLayer, PartialLineLayer, PartialFillLayer, PartialSymbolLayer };

export type StyleVariables = {
  lineColor: string;
  lineOpacity: number;
  lineWidth: number;
  fillColor: string;
  fillOpacity: number;
  circleMarkerRadius: number;
};

export type PartialLayerStyle =
  | PartialLineLayer
  | PartialFillLayer
  | PartialCircleLayer
  | PartialSymbolLayer;

export type SourceStyles = Record<keyof SourcesStorage, StyleVariables>;

export type LayerStyle = Record<keyof SourcesStorage, Array<PartialLayerStyle>>;
