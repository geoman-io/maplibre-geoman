import defaultLayerStyles from '@/core/options/layers/style.ts';
import type { ModeName } from '@/types/controls.ts';
import type { BaseControlsPosition, LngLatTuple } from '@/types/map/index.ts';
import type {
  ActionOptions,
  ActionSettings,
  DrawModeName,
  EditModeName,
  HelperModeName,
} from '@/types/modes/index.ts';
import type { PartialDeep } from 'type-fest';

import { ACTION_TYPES, MODE_TYPES } from '@/modes/constants.ts';
import type { GeoJsonShapeFeature, LngLatDiff, SegmentData } from './geojson.ts';
import type { FeatureData, GmEditMarkerMoveEvent } from '@/main.ts';

export type ModeType = (typeof MODE_TYPES)[number];
export type ActionType = (typeof ACTION_TYPES)[number];

export interface ControlOptions {
  title: string;
  icon: string | null;
  uiEnabled: boolean;
  active: boolean;
  options?: ActionOptions;
  settings?: ActionSettings;
  order?: number;
}

export interface ControlStyles {
  controlGroupClass: string;
  controlContainerClass: string;
  controlButtonClass: string;
}

export type GmOptionsData = {
  settings: {
    throttlingDelay: number;
    /**
     * When true, events like gm:create and gm:remove will wait for MapLibre
     * to commit data updates before firing. This ensures feature data is
     * accessible in event handlers via exportGeoJson().
     *
     * Set to false for faster async updates if you don't need immediate
     * data consistency in event handlers.
     *
     * @default true
     */
    awaitDataUpdatesOnEvents: boolean;
    useDefaultLayers: boolean;
    useControlsUi: boolean;
    controlsPosition: BaseControlsPosition;
    controlsUiEnabledByDefault: boolean;
    controlsCollapsible: boolean;
    controlsStyles: ControlStyles;
    idGenerator: null | ((shapeGeoJson: GeoJsonShapeFeature) => string);
    /**
     * The snapping tolerance in pixels. When the cursor is within this distance
     * of a snappable point or line, snapping will activate.
     *
     * @default 18
     */
    snapDistance: number;
    markerIcons: {
      default: string;
      control: string;
    };
    customGetAllShapeSegments?: (featureData: FeatureData) => SegmentData[] | null;
    customVertexUpdateHandler?: (event: GmEditMarkerMoveEvent) => GeoJsonShapeFeature | null;
    customDragHandler?: (
      featureData: FeatureData,
      lngLatDiff: LngLatDiff,
    ) => GeoJsonShapeFeature | null;
    customRotateHandler?: (
      event: GmEditMarkerMoveEvent,
      shapeCentroid: LngLatTuple,
    ) => GeoJsonShapeFeature | null;
  };
  layerStyles: typeof defaultLayerStyles;
  controls: {
    draw: { [key in DrawModeName]?: ControlOptions };
    edit: { [key in EditModeName]?: ControlOptions };
    helper: { [key in HelperModeName]?: ControlOptions };
  };
};
export type GmOptionsPartial = PartialDeep<GmOptionsData>;
export type GenericControlsOptions = {
  [key in ModeName]?: ControlOptions;
};
