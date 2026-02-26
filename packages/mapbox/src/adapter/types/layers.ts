import type {
  CircleLayerSpecification,
  FillLayerSpecification,
  LayerSpecification,
  LineLayerSpecification,
  SymbolLayerSpecification,
} from 'mapbox-gl';

// NOTE: Don't use mapbox types directly outside of "packages/mapbox/src/adapter" directory

export type MapboxAnyLayer = LayerSpecification;

export type PartialCircleLayer = Pick<CircleLayerSpecification, 'type' | 'paint' | 'layout'>;

export type PartialLineLayer = Pick<LineLayerSpecification, 'type' | 'paint' | 'layout'>;

export type PartialFillLayer = Pick<FillLayerSpecification, 'type' | 'paint' | 'layout'>;

export type PartialSymbolLayer = Pick<SymbolLayerSpecification, 'type' | 'paint' | 'layout'>;
