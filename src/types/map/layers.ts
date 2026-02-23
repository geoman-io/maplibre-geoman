import type { SourcesStorage } from '@/types/features.ts';
import type {
  PartialCircleLayer,
  PartialFillLayer,
  PartialLineLayer,
  PartialSymbolLayer,
} from '@mapLib/types/layers.ts';
import type { SetOptional } from 'type-fest';
import { SOURCES } from '@/core/features/constants.ts';

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

export type SourceStyles = SetOptional<
  Record<keyof SourcesStorage, StyleVariables>,
  typeof SOURCES.standby
>;

export type LayerStyle = SetOptional<
  Record<keyof SourcesStorage, Array<PartialLayerStyle>>,
  typeof SOURCES.standby
>;
