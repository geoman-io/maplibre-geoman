import ml, {
  type CircleLayerSpecification,
  type FillLayerSpecification,
  type LineLayerSpecification,
  type SymbolLayerSpecification,
} from 'maplibre-gl';

export type MaplibreAnyLayer = NonNullable<ReturnType<ml.Map['getLayer']>>;

export type PartialCircleLayer = Pick<CircleLayerSpecification, 'type' | 'paint' | 'layout'>;

export type PartialLineLayer = Pick<LineLayerSpecification, 'type' | 'paint' | 'layout'>;

export type PartialFillLayer = Pick<FillLayerSpecification, 'type' | 'paint' | 'layout'>;

export type PartialSymbolLayer = Pick<SymbolLayerSpecification, 'type' | 'paint' | 'layout'>;
