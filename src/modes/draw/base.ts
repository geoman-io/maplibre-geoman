import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { SOURCES } from '@/core/features/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import type {
  ActionType,
  DrawModeName,
  EditModeName,
  GeoJsonShapeFeature,
  GmDrawShapeEvent,
  GmDrawShapeEventWithData,
  GmEvent,
  GmFeatureBeforeCreateEvent,
  MarkerData,
  NonEmptyArray,
  ShapeName,
} from '@/main.ts';
import { BaseAction } from '@/modes/base-action.ts';
import { isGmDrawLineDrawerEvent } from '@/utils/guards/events/draw.ts';
import log from 'loglevel';

export abstract class BaseDraw extends BaseAction {
  actionType: ActionType = 'draw';
  abstract mode: DrawModeName;
  shape: ShapeName | null = null;
  featureData: FeatureData | null = null;

  saveFeature() {
    // todo: check is it possible to avoid recreating a feature
    // todo: check ellipse to fit all the rest shapes
    if (this.featureData) {
      const featureGeoJson = this.featureData.getGeoJson();
      this.removeTmpFeature();
      this.gm.features.createFeature({
        sourceName: SOURCES.main,
        shapeGeoJson: featureGeoJson,
      });
    } else {
      log.error('BaseDraw.saveFeature: no featureData to save');
    }
  }

  removeTmpFeature() {
    if (this.featureData) {
      if (!this.featureData.temporary) {
        log.error('Not a temporary feature to remove', this.featureData);
      }
      this.gm.features.delete(this.featureData);
      this.featureData = null;
    }
  }

  fireBeforeFeatureCreate({
    geoJsonFeatures,
    forceMode = undefined,
  }: {
    geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
    forceMode?: EditModeName;
  }) {
    this.flags.featureCreateAllowed = true;

    const payload: GmFeatureBeforeCreateEvent = {
      name: `${GM_SYSTEM_PREFIX}:feature:before_create`,
      level: 'system',
      actionType: 'draw',
      mode: forceMode || this.mode,
      action: 'before_create',
      geoJsonFeatures,
    };
    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:${this.actionType}`, payload);
  }

  fireMarkerPointerStartEvent() {
    if (!this.gm.markerPointer.marker || !this.shape) {
      return;
    }

    const marker = this.gm.markerPointer.marker;
    const payload: GmDrawShapeEventWithData = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
      level: 'system',
      variant: null,
      actionType: 'draw',
      mode: this.shape,
      action: 'start',
      markerData: {
        type: 'dom',
        instance: marker,
        position: {
          coordinate: marker.getLngLat(),
          path: [-1],
        },
      },
      featureData: this.featureData,
    };
    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, payload);
  }

  fireMarkerPointerUpdateEvent() {
    if (!this.gm.markerPointer.marker || !this.shape) {
      return;
    }

    const marker = this.gm.markerPointer.marker;
    const payload: GmDrawShapeEventWithData = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
      level: 'system',
      variant: null,
      actionType: 'draw',
      mode: this.shape,
      action: 'update',
      markerData: {
        type: 'dom',
        instance: marker,
        position: {
          coordinate: marker.getLngLat(),
          path: [-1],
        },
      },
      featureData: this.featureData,
    };
    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, payload);
  }

  fireMarkerPointerFinishEvent() {
    if (!this.shape) {
      return;
    }

    const payload: GmDrawShapeEvent = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape`,
      level: 'system',
      variant: null,
      actionType: 'draw',
      mode: this.shape,
      action: 'finish',
    };
    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, payload);
  }

  forwardLineDrawerEvent(payload: GmEvent) {
    if (!isGmDrawLineDrawerEvent(payload) || !this.shape) {
      return { next: true };
    }

    if (payload.action === 'start' || payload.action === 'update') {
      const eventData: GmDrawShapeEventWithData = {
        name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
        level: 'system',
        actionType: 'draw',
        mode: this.shape,
        variant: null,
        action: payload.action,
        featureData: payload.featureData,
        markerData: payload.markerData,
      };
      this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, eventData);
    } else if (payload.action === 'finish' || payload.action === 'cancel') {
      const eventData: GmDrawShapeEvent = {
        name: `${GM_SYSTEM_PREFIX}:draw:shape`,
        level: 'system',
        actionType: 'draw',
        mode: this.shape,
        variant: null,
        action: payload.action,
      };
      this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, eventData);
    }

    return { next: true };
  }

  fireStartEvent(featureData: FeatureData, markerData: MarkerData | null = null) {
    if (!this.shape) {
      return;
    }

    const event: GmDrawShapeEventWithData = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
      level: 'system',
      actionType: 'draw',
      mode: this.shape,
      variant: null,
      action: 'start',
      featureData,
      markerData,
    };
    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, event);
  }

  fireUpdateEvent(featureData: FeatureData, markerData: MarkerData | null = null) {
    if (!this.shape) {
      return;
    }

    const event: GmDrawShapeEventWithData = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
      level: 'system',
      actionType: 'draw',
      mode: this.shape,
      variant: null,
      action: 'update',
      featureData,
      markerData,
    };
    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, event);
  }

  fireFinishEvent() {
    if (!this.shape) {
      return;
    }

    const event: GmDrawShapeEvent = {
      name: `${GM_SYSTEM_PREFIX}:draw:shape`,
      level: 'system',
      actionType: 'draw',
      mode: this.shape,
      variant: null,
      action: 'finish',
    };
    this.gm.events.fire(`${GM_SYSTEM_PREFIX}:draw`, event);
  }
}
