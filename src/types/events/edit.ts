import { FeatureData } from '@/core/features/feature-data.ts';
import { type GmBaseEvent, type GmSystemPrefix, type NonEmptyArray } from '@/types/events/index.ts';
import type { GmBaseModeEvent } from '@/types/events/mode.ts';
import type { LngLatTuple } from '@/types/map/index.ts';
import type { DrawModeName, EditModeName, MarkerData } from '@/types/modes/index.ts';
import type { FeatureId } from '../features';

// Edit events
export interface GmEditModeEvent extends GmBaseModeEvent {
  name: `${GmSystemPrefix}:edit:mode`;
  actionType: 'edit';
  mode: EditModeName;
}

export interface GmEditMarkerMoveEvent extends GmBaseEvent {
  name: `${GmSystemPrefix}:edit:marker_move`;
  actionType: 'edit';
  mode: EditModeName;
  action: 'marker_move';
  featureData: FeatureData;
  markerData: MarkerData;
  lngLatStart: LngLatTuple;
  lngLatEnd: LngLatTuple;
  linkedFeatures: FeatureData[];
}

export interface GmEditMarkerEvent extends GmBaseEvent {
  name: `${GmSystemPrefix}:edit:marker`;
  actionType: 'edit';
  mode: EditModeName;
  action: 'edge_marker_click' | 'marker_right_click' | 'marker_captured' | 'marker_released';
  featureData: FeatureData;
  markerData: MarkerData;
  linkedFeatures?: Array<FeatureData>;
}

export interface GmEditFeatureRemovedEvent extends GmBaseEvent {
  name: `${GmSystemPrefix}:edit:feature_removed`;
  actionType: 'edit';
  mode: DrawModeName;
  action: 'feature_removed';
  featureData: FeatureData;
}

export interface GmEditFeatureUpdatedEvent extends GmBaseEvent {
  name: `${GmSystemPrefix}:edit:feature_updated`;
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

export interface GmEditFeatureEditStartEvent extends GmBaseEvent {
  // fired when a long action is supposed for a mode
  // examples: edit:change, edit:rotate, edit: scale
  name: `${GmSystemPrefix}:edit:feature_edit_start`;
  actionType: 'edit';
  mode: EditModeName;
  action: 'feature_edit_start';
  feature: FeatureData;
}

export interface GmEditFeatureEditEndEvent extends GmBaseEvent {
  // fired when a long action is supposed for a mode
  // examples: edit:change, edit:rotate, edit: scale
  name: `${GmSystemPrefix}:edit:feature_edit_end`;
  actionType: 'edit';
  mode: EditModeName;
  action: 'feature_edit_end';
  feature: FeatureData;
}

export interface GmEditSelectionChangeEvent extends GmBaseEvent {
  name: `${GmSystemPrefix}:edit:selection_change`;
  actionType: 'edit';
  mode: null;
  action: 'selection_change';
  selection: FeatureId[];
}

export type GmEditEvent =
  | GmEditModeEvent
  | GmEditMarkerEvent
  | GmEditMarkerMoveEvent
  | GmEditFeatureUpdatedEvent
  | GmEditFeatureEditStartEvent
  | GmEditFeatureEditEndEvent
  | GmEditFeatureRemovedEvent
  | GmEditSelectionChangeEvent;
