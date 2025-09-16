import { FeatureData } from '@/core/features/feature-data.ts';
import { type GMBaseEvent, type NonEmptyArray } from '@/types/events/index.ts';
import type { GmBaseModeEvent } from '@/types/events/mode.ts';
import type { LngLat } from '@/types/map/index.ts';
import type { DrawModeName, EditModeName, MarkerData } from '@/types/modes/index.ts';

// Edit events
export interface GMEditModeEvent extends GmBaseModeEvent {
  actionType: 'edit';
  mode: EditModeName;
}

export interface GMEditMarkerMoveEvent extends GMBaseEvent {
  actionType: 'edit';
  mode: EditModeName;
  action: 'marker_move';
  featureData: FeatureData;
  markerData: MarkerData;
  lngLatStart: LngLat;
  lngLatEnd: LngLat;
}

export interface GMEditMarkerEvent extends GMBaseEvent {
  actionType: 'edit';
  mode: EditModeName;
  action: 'edge_marker_click' | 'marker_right_click' | 'marker_captured' | 'marker_released';
  featureData: FeatureData;
  markerData: MarkerData;
}

export interface GMEditFeatureRemovedEvent extends GMBaseEvent {
  actionType: 'edit';
  mode: DrawModeName;
  action: 'feature_removed';
  featureData: FeatureData;
}

export interface GMEditFeatureUpdatedEvent extends GMBaseEvent {
  actionType: 'edit';
  mode: EditModeName;
  action: 'feature_updated';

  // source could be a single feature or a group
  // edit:change, - single feature, edit:union, - group
  sourceFeatures: NonEmptyArray<FeatureData>;

  // target could be a single feature or a group
  // edit:rotate, - single feature, edit:split, - group
  targetFeatures: NonEmptyArray<FeatureData>;

  // a feature could be updated with or without a marker
  // for example:
  // edit:change -> with a marker
  // edit:drag -> without a marker
  markerData: MarkerData | null;
}

export interface GMEditFeatureEditStartEvent extends GMBaseEvent {
  // fired when a long action is supposed for a mode
  // examples: edit:change, edit:rotate, edit: scale
  actionType: 'edit';
  mode: EditModeName;
  action: 'feature_edit_start';
  feature: FeatureData;
}

export interface GMEditFeatureEditEndEvent extends GMBaseEvent {
  // fired when a long action is supposed for a mode
  // examples: edit:change, edit:rotate, edit: scale
  actionType: 'edit';
  mode: EditModeName;
  action: 'feature_edit_end';
  feature: FeatureData;
}

export type GMEditEvent =
  | GMEditModeEvent
  | GMEditMarkerEvent
  | GMEditMarkerMoveEvent
  | GMEditFeatureUpdatedEvent
  | GMEditFeatureEditStartEvent
  | GMEditFeatureEditEndEvent
  | GMEditFeatureRemovedEvent;
