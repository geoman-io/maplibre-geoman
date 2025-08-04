import { gmPrefix } from '@/core/events/listeners/base.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import { SOURCES } from '@/core/features/index.ts';
import type {
  ActionType,
  DrawModeName,
  GMDrawShapeEvent,
  GMDrawShapeEventWithData,
  GMEvent,
  ShapeName,
} from '@/main.ts';
import { BaseAction } from '@/modes/base-action.ts';
import { isGmDrawLineDrawerEvent } from '@/utils/guards/events/draw.ts';
import log from 'loglevel';


export const shapeNames = [
  // shapes
  'marker',
  'ellipse',
  'circle',
  'circle_marker',
  'text_marker',
  'line',
  'rectangle',
  'polygon',
] as const;

export const extraDrawModes = [
  'freehand',
  'custom_shape',
] as const;

export const drawModes = [
  ...shapeNames,
  ...extraDrawModes,
] as const;


export abstract class BaseDraw extends BaseAction {
  actionType: ActionType = 'draw';
  abstract mode: DrawModeName;
  shape: ShapeName | null = null;
  featureData: FeatureData | null = null;

  saveFeature() {
    if (this.featureData) {
      const featureGeoJson = this.featureData.getGeoJson(true);
      this.removeTmpFeature();
      this.gm.features.createFeature({
        sourceName: SOURCES.main,
        shapeGeoJson: featureGeoJson
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

  fireMarkerPointerStartEvent() {
    if (!this.gm.markerPointer.marker || !this.shape) {
      return;
    }

    const marker = this.gm.markerPointer.marker;
    const payload: GMDrawShapeEventWithData = {
      level: 'system',
      variant: null,
      type: 'draw',
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
    this.gm.events.fire(`${gmPrefix}:draw`, payload);
  }

  fireMarkerPointerUpdateEvent() {
    if (!this.gm.markerPointer.marker || !this.shape) {
      return;
    }

    const marker = this.gm.markerPointer.marker;
    const payload: GMDrawShapeEventWithData = {
      level: 'system',
      variant: null,
      type: 'draw',
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
    this.gm.events.fire(`${gmPrefix}:draw`, payload);
  }

  fireMarkerPointerFinishEvent() {
    if (!this.shape) {
      return;
    }

    const payload: GMDrawShapeEvent = {
      level: 'system',
      variant: null,
      type: 'draw',
      mode: this.shape,
      action: 'finish',
    };
    this.gm.events.fire(`${gmPrefix}:draw`, payload);
  }

  forwardLineDrawerEvent(payload: GMEvent) {
    if (!isGmDrawLineDrawerEvent(payload) || !this.shape) {
      return { next: true };
    }

    if (payload.action === 'start' || payload.action === 'update') {
      const eventData: GMDrawShapeEventWithData = {
        level: 'system',
        type: 'draw',
        mode: this.shape,
        variant: null,
        action: payload.action,
        featureData: payload.featureData,
        markerData: payload.markerData,
      };
      this.gm.events.fire(`${gmPrefix}:draw`, eventData);
    } else if (payload.action === 'finish' || payload.action === 'cancel') {
      const eventData: GMDrawShapeEvent = {
        level: 'system',
        type: 'draw',
        mode: this.shape,
        variant: null,
        action: payload.action,
      };
      this.gm.events.fire(`${gmPrefix}:draw`, eventData);
    }

    return { next: true };
  }
}
