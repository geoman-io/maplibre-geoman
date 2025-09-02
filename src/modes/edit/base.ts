import { FeatureData } from '@/core/features/feature-data.ts';
import {
  type ActionType,
  type DrawModeName,
  type EditModeName,
  type GeoJsonShapeFeature,
  GM_PREFIX,
  type GMDrawShapeEvent,
  type GMDrawShapeEventWithData,
  type GMEditFeatureEditEndEvent,
  type GMEditFeatureEditStartEvent,
  type GMEditFeatureRemovedEvent,
  type GMEditFeatureUpdatedEvent,
  type GMEvent,
  type MarkerData,
  type NonEmptyArray,
  type PointerEventName,
  SHAPE_NAMES,
} from '@/main.ts';
import { BaseAction } from '@/modes/base-action.ts';
import { isGmDrawLineDrawerEvent } from '@/utils/guards/events/draw.ts';
import { includesWithType } from '@/utils/typing.ts';

export abstract class BaseEdit extends BaseAction {
  actionType: ActionType = 'edit';
  abstract mode: EditModeName;
  featureData: FeatureData | null = null;
  cursorExcludedLayerIds: Array<string> = ['rectangle-line', 'polygon-line', 'circle-line'];
  layerEventHandlersData: Array<{
    eventName: PointerEventName;
    layerId: string;
    callback: () => void;
  }> = [];

  startAction() {
    this.setEventsForLayers('mouseenter', this.setCursorToPointer.bind(this));
    this.setEventsForLayers('mouseleave', this.setCursorToEmpty.bind(this));
    super.startAction();
  }

  endAction() {
    this.clearEventsForLayers();
    super.endAction();
  }

  setCursorToPointer() {
    this.gm.mapAdapter.setCursor('pointer');
  }

  setCursorToEmpty() {
    this.gm.mapAdapter.setCursor('');
  }

  setEventsForLayers(eventName: PointerEventName, callback: () => void) {
    const targetLayerIds = this.gm.features.layers
      .map((layer) => layer.id)
      .filter(
        (layerId) => !this.cursorExcludedLayerIds.some((subName) => layerId.includes(subName)),
      );

    targetLayerIds.forEach((layerId) => {
      this.gm.mapAdapter.on(eventName, layerId, callback);
      this.layerEventHandlersData.push({ eventName, layerId, callback });
    });
  }

  clearEventsForLayers() {
    this.layerEventHandlersData.forEach(({ eventName, layerId, callback }) => {
      this.gm.mapAdapter.off(eventName, layerId, callback);
    });
    this.layerEventHandlersData = [];
  }

  updateFeatureGeoJson({
    featureData,
    featureGeoJson,
    forceMode = undefined,
  }: {
    featureData: FeatureData;
    featureGeoJson: GeoJsonShapeFeature;
    forceMode?: EditModeName;
  }): boolean {
    if (!this.flags.featureUpdateAllowed) {
      // used for geofencing violations, other modes could be added in the future
      return false;
    }

    const properties = featureGeoJson.properties;

    // when moving the feature, shape properties are saved in properties
    if (properties.shape === 'circle' && properties.center) {
      featureData.setShapeProperty('center', properties.center);
    }
    if (properties.shape === 'ellipse' && properties._gm_shape_center) {
      featureData.setShapeProperty('center', properties._gm_shape_center);
      featureData.setShapeProperty('xSemiAxis', properties._gm_shape_xSemiAxis);
      featureData.setShapeProperty('ySemiAxis', properties._gm_shape_ySemiAxis);
      featureData.setShapeProperty('angle', properties._gm_shape_angle);
    }

    featureData.updateGeoJsonGeometry(featureGeoJson.geometry);

    this.fireFeatureUpdatedEvent({
      sourceFeatures: [featureData],
      targetFeatures: [featureData],
      forceMode,
    });

    return true;
  }

  fireFeatureUpdatedEvent({
    sourceFeatures,
    targetFeatures,
    markerData = undefined,
    forceMode = undefined,
  }: {
    sourceFeatures: NonEmptyArray<FeatureData>;
    targetFeatures: NonEmptyArray<FeatureData>;
    markerData?: MarkerData;
    forceMode?: EditModeName;
  }) {
    const payload: GMEditFeatureUpdatedEvent = {
      level: 'system',
      type: 'edit',
      action: 'feature_updated',
      mode: forceMode || this.mode,
      sourceFeatures,
      targetFeatures,
      markerData: markerData || null,
    };

    this.gm.events.fire(`${GM_PREFIX}:edit`, payload);
  }

  fireFeatureEditStartEvent({
    feature,
    forceMode = undefined,
  }: {
    feature: FeatureData;
    forceMode?: EditModeName;
  }) {
    const payload: GMEditFeatureEditStartEvent = {
      level: 'system',
      type: 'edit',
      action: 'feature_edit_start',
      mode: forceMode || this.mode,
      feature,
    };

    this.gm.events.fire(`${GM_PREFIX}:edit`, payload);
  }

  fireFeatureEditEndEvent({
    feature,
    forceMode = undefined,
  }: {
    feature: FeatureData;
    forceMode?: EditModeName;
  }) {
    const payload: GMEditFeatureEditEndEvent = {
      level: 'system',
      type: 'edit',
      action: 'feature_edit_end',
      mode: forceMode || this.mode,
      feature,
    };

    this.gm.events.fire(`${GM_PREFIX}:edit`, payload);
  }

  fireMarkerPointerUpdateEvent() {
    if (!this.gm.markerPointer.marker) {
      return;
    }

    const marker = this.gm.markerPointer.marker;
    const payload: GMDrawShapeEventWithData = {
      level: 'system',
      variant: null,
      type: 'draw',
      mode: this.getLineDrawerMode(),
      action: 'update',
      markerData: {
        type: 'dom',
        instance: marker,
        position: {
          coordinate: marker.getLngLat(),
          path: [-1],
        },
      },
      featureData: null,
    };
    this.gm.events.fire(`${GM_PREFIX}:draw`, payload);
  }

  forwardLineDrawerEvent(payload: GMEvent) {
    if (!isGmDrawLineDrawerEvent(payload) || !['cut', 'split'].includes(this.mode)) {
      return { next: true };
    }

    if (payload.action === 'start' || payload.action === 'update') {
      const eventData: GMDrawShapeEventWithData = {
        level: 'system',
        type: 'draw',
        mode: this.getLineDrawerMode(),
        variant: null,
        action: payload.action,
        featureData: payload.featureData,
        markerData: payload.markerData,
      };
      this.gm.events.fire(`${GM_PREFIX}:draw`, eventData);
    } else if (payload.action === 'finish' || payload.action === 'cancel') {
      const eventData: GMDrawShapeEvent = {
        level: 'system',
        type: 'draw',
        mode: this.getLineDrawerMode(),
        variant: null,
        action: payload.action,
      };
      this.gm.events.fire(`${GM_PREFIX}:draw`, eventData);
    }

    return { next: true };
  }

  fireFeatureRemovedEvent(featureData: FeatureData) {
    if (includesWithType(featureData.shape, SHAPE_NAMES)) {
      const payload: GMEditFeatureRemovedEvent = {
        level: 'system',
        type: 'edit',
        mode: featureData.shape,
        action: 'feature_removed',
        featureData,
      };
      this.gm.events.fire(`${GM_PREFIX}:edit`, payload);
    }
  }

  getLineDrawerMode(): DrawModeName {
    if (this.mode === 'cut') {
      return 'polygon';
    } else if (this.mode === 'split') {
      return 'line';
    }
    return 'line';
  }
}
