import { FeatureData } from '@/core/features/feature-data.ts';
import {
  type ActionType,
  type AnyEvent,
  type DrawModeName,
  type EditModeName,
  type FeatureSourceName,
  type GeoJsonShapeFeature,
  GM_PREFIX,
  type GmBeforeFeatureUpdateEvent,
  type GmDrawShapeEvent,
  type GmDrawShapeEventWithData,
  type GmEditFeatureEditEndEvent,
  type GmEditFeatureEditStartEvent,
  type GmEditFeatureRemovedEvent,
  type GmEditFeatureUpdatedEvent,
  type GmEvent,
  type MarkerData,
  type NonEmptyArray,
  type PointerEventName,
  SHAPE_NAMES,
} from '@/main.ts';
import { BaseAction } from '@/modes/base-action.ts';
import { isGmDrawLineDrawerEvent } from '@/utils/guards/events/draw.ts';
import { includesWithType } from '@/utils/typing.ts';
import { isEqual } from 'lodash-es';

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
    if (this.flags.actionInProgress) {
      return;
    }
    this.gm.mapAdapter.setCursor('pointer');
  }

  setCursorToEmpty() {
    if (this.flags.actionInProgress) {
      return;
    }
    this.gm.mapAdapter.setCursor('');
  }

  getFeatureByMouseEvent({
    event,
    sourceNames,
  }: {
    event: AnyEvent;
    sourceNames: Array<FeatureSourceName>;
  }): FeatureData | null {
    const featureData = this.gm.features.getFeatureByMouseEvent({
      event,
      sourceNames,
    });

    if (!featureData || featureData.getShapeProperty('disableEdit') === true) {
      return null;
    }
    return featureData;
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

    featureData.updateGeoJsonGeometry(featureGeoJson.geometry);
    if (!isEqual(featureData.getGeoJson().properties, featureGeoJson.properties)) {
      featureData.updateGeoJsonProperties(featureGeoJson.properties);
    }

    this.fireFeatureUpdatedEvent({
      sourceFeatures: [featureData],
      targetFeatures: [featureData],
      forceMode,
    });

    return true;
  }

  fireBeforeFeatureUpdate({
    features,
    geoJsonFeatures,
    forceMode = undefined,
  }: {
    features: NonEmptyArray<FeatureData>;
    geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
    forceMode?: EditModeName;
  }) {
    this.flags.featureUpdateAllowed = true;

    const payload: GmBeforeFeatureUpdateEvent = {
      level: 'system',
      actionType: 'edit',
      mode: forceMode || this.mode,
      action: 'before_update',
      features,
      geoJsonFeatures,
    };
    this.gm.events.fire(`${GM_PREFIX}:${this.actionType}`, payload);
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
    const payload: GmEditFeatureUpdatedEvent = {
      level: 'system',
      actionType: 'edit',
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
    const payload: GmEditFeatureEditStartEvent = {
      level: 'system',
      actionType: 'edit',
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
    const payload: GmEditFeatureEditEndEvent = {
      level: 'system',
      actionType: 'edit',
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
    const payload: GmDrawShapeEventWithData = {
      level: 'system',
      variant: null,
      actionType: 'draw',
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

  forwardLineDrawerEvent(payload: GmEvent) {
    if (!isGmDrawLineDrawerEvent(payload) || !['cut', 'split'].includes(this.mode)) {
      return { next: true };
    }

    if (payload.action === 'start' || payload.action === 'update') {
      const eventData: GmDrawShapeEventWithData = {
        level: 'system',
        actionType: 'draw',
        mode: this.getLineDrawerMode(),
        variant: null,
        action: payload.action,
        featureData: payload.featureData,
        markerData: payload.markerData,
      };
      this.gm.events.fire(`${GM_PREFIX}:draw`, eventData);
    } else if (payload.action === 'finish' || payload.action === 'cancel') {
      const eventData: GmDrawShapeEvent = {
        level: 'system',
        actionType: 'draw',
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
      const payload: GmEditFeatureRemovedEvent = {
        level: 'system',
        actionType: 'edit',
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
