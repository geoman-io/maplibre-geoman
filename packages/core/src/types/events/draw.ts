import { FeatureData } from '@/core/features/feature-data.ts';
import type { GeoJsonLineFeature, GmSystemPrefix } from '@/types';
import { type GmBaseEvent } from '@/types/events/index.ts';
import type { GmBaseModeEvent } from '@/types/events/mode.ts';
import type { DrawModeName, MarkerData } from '@/types/modes/index.ts';

export interface GmDrawModeEvent extends GmBaseModeEvent {
  name: `${GmSystemPrefix}:draw:mode`;
  actionType: 'draw';
  mode: DrawModeName;
}

export interface GmDrawShapeEvent extends GmBaseEvent {
  name: `${GmSystemPrefix}:draw:shape`;
  actionType: 'draw';
  mode: DrawModeName;
  variant: null;
  action: 'finish' | 'cancel';
}

export interface GmDrawShapeEventWithData extends GmBaseEvent {
  name: `${GmSystemPrefix}:draw:shape_with_data`;
  actionType: 'draw';
  mode: DrawModeName;
  variant: null;
  action: 'start' | 'update' | 'finish';
  markerData: MarkerData | null;
  featureData: FeatureData | null;
}

export interface GmDrawFeatureCreatedEvent extends GmBaseEvent {
  name: `${GmSystemPrefix}:draw:feature_created`;
  actionType: 'draw';
  mode: DrawModeName;
  action: 'feature_created';
  featureData: FeatureData;
}

export type GmDrawLineDrawerEvent = Omit<GmDrawShapeEvent, 'mode' | 'variant'> & {
  mode: 'line';
  variant: 'line_drawer';
};

export type GmDrawFreehandDrawerEvent = Omit<GmDrawShapeEvent, 'mode' | 'variant'> & {
  mode: 'line' | 'polygon';
  variant: 'freehand_drawer';
};

export type GmDrawLineDrawerEventWithData = Omit<GmDrawShapeEventWithData, 'mode' | 'variant'> & {
  mode: 'line';
  variant: 'line_drawer';
  geoJsonFeature?: GeoJsonLineFeature;
};

export type GmDrawFreehandDrawerEventWithData = Omit<
  GmDrawShapeEventWithData,
  'mode' | 'variant'
> & {
  mode: 'line' | 'polygon';
  variant: 'freehand_drawer';
};

export type GmDrawEvent =
  | GmDrawModeEvent
  | GmDrawShapeEvent
  | GmDrawShapeEventWithData
  | GmDrawLineDrawerEvent
  | GmDrawLineDrawerEventWithData
  | GmDrawFreehandDrawerEvent
  | GmDrawFreehandDrawerEventWithData
  | GmDrawFeatureCreatedEvent;
