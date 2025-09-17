import { GM_PREFIX, GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import type {
  AnyEventName,
  EditModeName,
  FeatureCreatedFwdEvent,
  FeatureEditEndFwdEvent,
  FeatureEditStartFwdEvent,
  FeatureRemovedFwdEvent,
  FeatureUpdatedFwdEvent,
  FwdEditModeName,
  Geoman,
  GlobalEventsListener,
  GlobalModeToggledFwdEvent,
  GmControlLoadEvent,
  GmDrawModeEvent,
  GmDrawShapeCreatedEvent,
  GmEditFeatureEditEndEvent,
  GmEditFeatureEditStartEvent,
  GmEditFeatureRemovedEvent,
  GmEditFeatureUpdatedEvent,
  GmEditModeEvent,
  GmEvent,
  GmEventName,
  GmEventNameWithoutPrefix,
  GmFwdEvent,
  GmFwdEventName,
  GmHelperModeEvent,
  ModeName,
} from '@/main.ts';

export class EventForwarder {
  gm: Geoman;
  globalEventsListener: GlobalEventsListener | null = null;

  constructor(gm: Geoman) {
    this.gm = gm;
  }

  get map() {
    return this.gm.mapAdapter.getMapInstance();
  }

  processEvent(eventName: GmEventName, payload: GmEvent) {
    // repeat the events to the map to allow end users to listen
    this.fireToMap({
      type: 'system',
      eventName: eventName.split(':')[1] as GmEventNameWithoutPrefix,
      payload: {
        ...payload,
        level: 'user',
      },
    });

    if (payload.action === 'mode_start' || payload.action === 'mode_end') {
      this.forwardModeToggledEvent(payload);
    } else if (payload.action === 'feature_created') {
      this.forwardFeatureCreated(payload);
    } else if (payload.action === 'feature_removed') {
      this.forwardFeatureRemoved(payload);
    } else if (payload.action === 'feature_updated') {
      this.forwardFeatureUpdated(payload);
    } else if (payload.action === 'feature_edit_start') {
      this.forwardFeatureEditStart(payload);
    } else if (payload.action === 'feature_edit_end') {
      this.forwardFeatureEditEnd(payload);
    } else if (payload.action === 'loaded' || payload.action === 'unloaded') {
      this.forwardGeomanLoaded(payload);
    }
  }

  forwardModeToggledEvent(payload: GmDrawModeEvent | GmEditModeEvent | GmHelperModeEvent) {
    const enabled = payload.action === 'mode_start';
    let eventData: GlobalModeToggledFwdEvent;

    if (payload.actionType === 'draw') {
      // global draw mode toggled
      const eventName = 'globaldrawmodetoggled';
      eventData = {
        actionType: payload.actionType,
        action: payload.action,
        enabled,
        shape: payload.mode,
        map: this.map,
      };
      this.fireToMap({ type: 'converted', eventName, payload: eventData });

      // drawstart, drawend
      eventData = {
        actionType: payload.actionType,
        action: payload.action,
        shape: payload.mode,
        map: this.map,
      };
      this.fireToMap({
        type: 'converted',
        eventName: enabled ? 'drawstart' : 'drawend',
        payload: eventData,
      });
    } else if (payload.actionType === 'edit') {
      const modeName = this.getConvertedEditModeName(payload.mode);
      eventData = {
        actionType: payload.actionType,
        action: payload.action,
        enabled,
        map: this.map,
      };
      this.fireToMap({
        type: 'converted',
        eventName: `global${modeName}modetoggled`,
        payload: eventData,
      });
    } else if (payload.actionType === 'helper') {
      eventData = {
        actionType: payload.actionType,
        action: payload.action,
        enabled,
        map: this.map,
      };
      this.fireToMap({
        type: 'converted',
        eventName: `global${payload.mode}modetoggled`,
        payload: eventData,
      });
    }
  }

  forwardFeatureCreated(payload: GmDrawShapeCreatedEvent) {
    const eventData: FeatureCreatedFwdEvent = {
      actionType: payload.actionType,
      action: payload.action,
      shape: payload.mode,
      feature: payload.featureData,
      map: this.map,
    };
    this.fireToMap({ type: 'converted', eventName: 'create', payload: eventData });
  }

  forwardFeatureRemoved(payload: GmEditFeatureRemovedEvent) {
    const eventData: FeatureRemovedFwdEvent = {
      actionType: payload.actionType,
      action: payload.action,
      shape: payload.mode,
      feature: payload.featureData,
      map: this.map,
    };
    this.fireToMap({ type: 'converted', eventName: 'remove', payload: eventData });
  }

  forwardFeatureUpdated(payload: GmEditFeatureUpdatedEvent) {
    const multiFeatureMode: Array<ModeName> = ['lasso'];
    const featuresPayload: FeatureUpdatedFwdEvent = {
      actionType: payload.actionType,
      action: payload.action,
      map: this.map,
    };

    if (payload.sourceFeatures.length === 1 && !multiFeatureMode.includes(payload.mode)) {
      featuresPayload.originalFeature = payload.sourceFeatures[0];
    } else {
      featuresPayload.originalFeatures = payload.sourceFeatures;
    }

    if (payload.targetFeatures.length === 1 && !multiFeatureMode.includes(payload.mode)) {
      featuresPayload.feature = payload.targetFeatures[0];
      featuresPayload.shape = featuresPayload.feature.shape;
    } else {
      featuresPayload.features = payload.targetFeatures;
    }

    const modeName = this.getConvertedEditModeName(payload.mode);
    this.fireToMap({ type: 'converted', eventName: `${modeName}`, payload: featuresPayload });
  }

  forwardFeatureEditStart(payload: GmEditFeatureEditStartEvent) {
    const modeName = this.getConvertedEditModeName(payload.mode);
    const eventData: FeatureEditStartFwdEvent = {
      actionType: payload.actionType,
      action: payload.action,
      shape: payload.feature.shape,
      feature: payload.feature,
      map: this.map,
    };
    this.fireToMap({ type: 'converted', eventName: `${modeName}start`, payload: eventData });
  }

  forwardFeatureEditEnd(payload: GmEditFeatureEditEndEvent) {
    const modeName = this.getConvertedEditModeName(payload.mode);
    const eventData: FeatureEditEndFwdEvent = {
      actionType: payload.actionType,
      action: payload.action,
      shape: payload.feature.shape,
      feature: payload.feature,
      map: this.map,
    };
    this.fireToMap({ type: 'converted', eventName: `${modeName}end`, payload: eventData });
  }

  forwardGeomanLoaded(payload: GmControlLoadEvent) {
    this.fireToMap({
      type: 'converted',
      eventName: `${payload.action}`,
      payload: {
        actionType: payload.actionType,
        action: payload.action,
        map: this.map,
        [GM_PREFIX]: this.gm,
      },
    });
  }

  fireToMap({
    type,
    eventName,
    payload,
  }:
    | { type: 'system'; eventName: GmEventNameWithoutPrefix; payload: GmEvent }
    | { type: 'converted'; eventName: GmFwdEventName; payload: GmFwdEvent }): void {
    const prefix = type === 'system' ? GM_SYSTEM_PREFIX : GM_PREFIX;
    const eventNameWithPrefix = `${prefix}:${eventName}`;

    if (this.globalEventsListener) {
      if (type === 'system') {
        this.globalEventsListener({
          type,
          name: `${GM_SYSTEM_PREFIX}:${eventName}`,
          payload,
        });
      } else if (type === 'converted') {
        this.globalEventsListener({
          type,
          name: `${GM_PREFIX}:${eventName}`,
          payload,
        });
      }
    }
    this.gm.mapAdapter.fire(eventNameWithPrefix as AnyEventName, payload);
  }

  getConvertedEditModeName(mode: EditModeName): FwdEditModeName {
    return mode === 'change' ? 'edit' : mode;
  }
}
