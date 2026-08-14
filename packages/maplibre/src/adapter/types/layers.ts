import type * as ml from 'maplibre-gl';

// NOTE: Don't use maplibre types directly outside of "packages/maplibre/src/adapter" directory

export type MaplibreAnyLayer = NonNullable<ReturnType<ml.Map['getLayer']>>;

export type PartialCircleLayer = Pick<ml.CircleLayerSpecification, 'type' | 'paint' | 'layout'>;

export type PartialLineLayer = Pick<ml.LineLayerSpecification, 'type' | 'paint' | 'layout'>;

export type PartialFillLayer = Pick<ml.FillLayerSpecification, 'type' | 'paint' | 'layout'>;

export type PartialSymbolLayer = Pick<ml.SymbolLayerSpecification, 'type' | 'paint' | 'layout'>;
