import { FeatureData } from '@/core/features/feature-data.ts';
import { type GMBaseEvent } from '@/types/events/index.ts';
import type { GmBaseModeEvent } from '@/types/events/mode.ts';
import type { DrawModeName, MarkerData } from '@/types/modes/index.ts';
import type { GeoJsonLineFeature } from '@/types';

export interface GMDrawModeEvent extends GmBaseModeEvent {
  type: 'draw';
  mode: DrawModeName;
}

export interface GMDrawShapeEvent extends GMBaseEvent {
  type: 'draw';
  mode: DrawModeName;
  variant: null;
  action: 'finish' | 'cancel';
}

export interface GMDrawShapeEventWithData extends GMBaseEvent {
  type: 'draw';
  mode: DrawModeName;
  variant: null;
  action: 'start' | 'update' | 'finish';
  markerData: MarkerData | null;
  featureData: FeatureData | null;
}

export interface GMDrawShapeCreatedEvent extends GMBaseEvent {
  type: 'draw';
  mode: DrawModeName;
  action: 'feature_created';
  featureData: FeatureData;
}

export type GMDrawLineDrawerEvent = Omit<GMDrawShapeEvent, 'mode' | 'variant'> & {
  mode: 'line';
  variant: 'line_drawer';
};

export type GMDrawFreehandDrawerEvent = Omit<GMDrawShapeEvent, 'mode' | 'variant'> & {
  mode: 'line' | 'polygon';
  variant: 'freehand_drawer';
};

export type GMDrawLineDrawerEventWithData = Omit<GMDrawShapeEventWithData, 'mode' | 'variant'> & {
  mode: 'line';
  variant: 'line_drawer';
  geoJsonFeature?: GeoJsonLineFeature;
};

export type GMDrawFreehandDrawerEventWithData = Omit<
  GMDrawShapeEventWithData,
  'mode' | 'variant'
> & {
  mode: 'line' | 'polygon';
  variant: 'freehand_drawer';
};

export type GMDrawEvent =
  | GMDrawModeEvent
  | GMDrawShapeEvent
  | GMDrawShapeEventWithData
  | GMDrawLineDrawerEvent
  | GMDrawLineDrawerEventWithData
  | GMDrawFreehandDrawerEvent
  | GMDrawFreehandDrawerEventWithData
  | GMDrawShapeCreatedEvent;
