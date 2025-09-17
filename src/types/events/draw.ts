import { FeatureData } from '@/core/features/feature-data.ts';
import { type GmBaseEvent } from '@/types/events/index.ts';
import type { GmBaseModeEvent } from '@/types/events/mode.ts';
import type { DrawModeName, MarkerData } from '@/types/modes/index.ts';
import type { GeoJsonLineFeature } from '@/types';

export interface GmDrawModeEvent extends GmBaseModeEvent {
  actionType: 'draw';
  mode: DrawModeName;
}

export interface GmDrawShapeEvent extends GmBaseEvent {
  actionType: 'draw';
  mode: DrawModeName;
  variant: null;
  action: 'finish' | 'cancel';
}

export interface GmDrawShapeEventWithData extends GmBaseEvent {
  actionType: 'draw';
  mode: DrawModeName;
  variant: null;
  action: 'start' | 'update' | 'finish';
  markerData: MarkerData | null;
  featureData: FeatureData | null;
}

export interface GmDrawShapeCreatedEvent extends GmBaseEvent {
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
  | GmDrawShapeCreatedEvent;
