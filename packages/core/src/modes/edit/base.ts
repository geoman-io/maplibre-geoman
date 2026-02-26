import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import {
  type ActionType,
  type DrawModeName,
  type EditModeName,
  type FeatureSourceName,
  type GeoJsonShapeFeature,
  type GmDrawShapeEvent,
  type GmDrawShapeEventWithData,
  type GmEditFeatureEditEndEvent,
  type GmEditFeatureEditStartEvent,
  type GmEditFeatureRemovedEvent,
  type GmEditFeatureUpdatedEvent,
  type GmFeatureBeforeUpdateEvent,
  type GmSystemEvent,
  type MarkerData,
  type NonEmptyArray,
  type PointerEventName,
  SHAPE_NAMES,
} from '@/main.ts';
import { BaseAction } from '@/modes/base-action.ts';
import { isGmDrawLineDrawerEvent } from '@/utils/guards/events/draw.ts';
import { includesWithType } from '@/utils/typing.ts';
import type { BaseMapPointerEvent } from '@mapLib/types/events.ts';
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

  async startAction() {
    this.setEventsForLayers('mouseenter', this.setCursorToPointer.bind(this));
    this.setEventsForLayers('mouseleave', this.setCursorToEmpty.bind(this));
    await super.startAction();
  }

  async endAction() {
    this.clearEventsForLayers();
    await super.endAction();
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
    event: BaseMapPointerEvent;
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

  async updateFeatureGeoJson({
    featureData,
    featureGeoJson,
    forceMode = undefined,
  }: {
    featureData: FeatureData;
    featureGeoJson: GeoJsonShapeFeature;
    forceMode?: EditModeName;
  }) {
    if (!this.flags.featureUpdateAllowed) {
      // used for geofencing violations, other modes could be added in the future
      return false;
    }

    await featureData.updateGeometry(featureGeoJson.geometry);
    if (!isEqual(featureData.getGeoJson().properties, featureGeoJson.properties)) {
      await featureData._updateAllProperties(featureGeoJson.properties);
    }

    await this.fireFeatureUpdatedEvent({
      sourceFeatures: [featureData],
      targetFeatures: [featureData],
      forceMode,
    });

    return true;
  }

  async fireBeforeFeatureUpdate({
    features,
    geoJsonFeatures,
    forceMode = undefined,
  }: {
    features: NonEmptyArray<FeatureData>;
    geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
    forceMode?: EditModeName;
  }) {
    this.flags.featureUpdateAllowed = true;

    const payload: GmFeatureBeforeUpdateEvent = {
      name: `${GM_SYSTEM_PREFIX}:feature:before_update`,
      level: 'system',
      actionType: 'edit',
      mode: forceMode || this.mode,
      action: 'before_update',
      features,
      geoJsonFeatures,
    };
    await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:${this.actionType}`, payload);
  }

  async fireFeatureUpdatedEvent({
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
      name: `${GM_SYSTEM_PREFIX}:edit:feature_updated`,
      level: 'system',
      actionType: 'edit',
      action: 'feature_updated',
      mode: forceMode || this.mode,
      sourceFeatures,
      targetFeatures,
      markerData: markerData || null,
    };

    await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:edit`, payload);
  }

  async fireFeatureEditStartEvent({
    feature,
    forceMode = undefined,
  }: {
    feature: FeatureData;
    forceMode?: EditModeName;
  }) {
    const payload: GmEditFeatureEditStartEvent = {
      name: `${GM_SYSTEM_PREFIX}:edit:feature_edit_start`,
      level: 'system',
      actionType: 'edit',
      action: 'feature_edit_start',
      mode: forceMode || this.mode,
      feature,
    };

    await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:edit`, payload);
  }

  async fireFeatureEditEndEvent({
    feature,
    forceMode = undefined,
  }: {
    feature: FeatureData;
    forceMode?: EditModeName;
  }) {
    const payload: GmEditFeatureEditEndEvent = {
      name: `${GM_SYSTEM_PREFIX}:edit:feature_edit_end`,
      level: 'system',
      actionType: 'edit',
      action: 'feature_edit_end',
      mode: forceMode || this.mode,
      feature,
    };

    await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:edit`, payload);
  }

  async fireMarkerPointerUpdateEvent() {
    if (!this.gm.markerPointer.marker) {
      return;
    }

    const marker = this.gm.markerPointer.marker;
    const payload: GmDrawShapeEventWithData = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
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
    await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, payload);
  }

  async forwardLineDrawerEvent(payload: GmSystemEvent) {
    if (!isGmDrawLineDrawerEvent(payload) || !['cut', 'split'].includes(this.mode)) {
      return { next: true };
    }

    if (payload.action === 'start' || payload.action === 'update') {
      const eventData: GmDrawShapeEventWithData = {
        name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
        level: 'system',
        actionType: 'draw',
        mode: this.getLineDrawerMode(),
        variant: null,
        action: payload.action,
        featureData: payload.featureData,
        markerData: payload.markerData,
      };
      await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, eventData);
    } else if (payload.action === 'finish' || payload.action === 'cancel') {
      const eventData: GmDrawShapeEvent = {
        name: `${GM_SYSTEM_PREFIX}:draw:shape`,
        level: 'system',
        actionType: 'draw',
        mode: this.getLineDrawerMode(),
        variant: null,
        action: payload.action,
      };
      await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, eventData);
    }

    return { next: true };
  }

  async fireFeatureRemovedEvent(featureData: FeatureData) {
    if (includesWithType(featureData.shape, SHAPE_NAMES)) {
      const payload: GmEditFeatureRemovedEvent = {
        name: `${GM_SYSTEM_PREFIX}:edit:feature_removed`,
        level: 'system',
        actionType: 'edit',
        mode: featureData.shape,
        action: 'feature_removed',
        featureData,
      };
      await this.gm.events.fire(`${GM_SYSTEM_PREFIX}:edit`, payload);
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
