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
  GlobalDrawEnabledDisabledFwdEvent,
  GlobalDrawToggledFwdEvent,
  GlobalEditToggledFwdEvent,
  GlobalEventsListener,
  GlobalHelperToggledFwdEvent,
  GmControlLoadEvent,
  GmDrawFeatureCreatedEvent,
  GmDrawModeEvent,
  GmEditFeatureEditEndEvent,
  GmEditFeatureEditStartEvent,
  GmEditFeatureRemovedEvent,
  GmEditFeatureUpdatedEvent,
  GmEditModeEvent,
  GmSystemEvent,
  GmEventName,
  GmEventNameWithoutPrefix,
  GmEvent,
  GmFwdEventName,
  GmHelperModeEvent,
  ModeName,
  SystemFwdEvent,
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

  processEvent(eventName: GmEventName, payload: GmSystemEvent) {
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

    if (payload.actionType === 'draw') {
      // global draw mode toggled
      const eventName = 'globaldrawmodetoggled';
      const eventData: GlobalDrawToggledFwdEvent = {
        type: `${GM_PREFIX}:${eventName}`,
        actionType: payload.actionType,
        action: payload.action,
        enabled,
        shape: payload.mode,
        map: this.map,
      };
      this.fireToMap({ type: 'converted', eventName, payload: eventData });

      // drawstart, drawend
      const eventName2 = enabled ? 'drawstart' : 'drawend';
      const eventData2: GlobalDrawEnabledDisabledFwdEvent = {
        type: `${GM_PREFIX}:${eventName2}`,
        actionType: payload.actionType,
        action: payload.action,
        shape: payload.mode,
        map: this.map,
      };
      this.fireToMap({
        type: 'converted',
        eventName: eventName2,
        payload: eventData2,
      });
    } else if (payload.actionType === 'edit') {
      const modeName = this.getConvertedEditModeName(payload.mode);
      const eventName = `global${modeName}modetoggled` as const;
      const eventData: GlobalEditToggledFwdEvent = {
        type: `${GM_PREFIX}:${eventName}`,
        actionType: payload.actionType,
        action: payload.action,
        enabled,
        map: this.map,
      };
      this.fireToMap({
        type: 'converted',
        eventName,
        payload: eventData,
      });
    } else if (payload.actionType === 'helper') {
      const eventName = `global${payload.mode}modetoggled` as const;
      const eventData: GlobalHelperToggledFwdEvent = {
        type: `${GM_PREFIX}:${eventName}`,
        actionType: payload.actionType,
        action: payload.action,
        enabled,
        map: this.map,
      };
      this.fireToMap({
        type: 'converted',
        eventName,
        payload: eventData,
      });
    }
  }

  forwardFeatureCreated(payload: GmDrawFeatureCreatedEvent) {
    const eventData: FeatureCreatedFwdEvent = {
      type: `${GM_PREFIX}:create`,
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
      type: `${GM_PREFIX}:remove`,
      actionType: payload.actionType,
      action: payload.action,
      shape: payload.mode,
      feature: payload.featureData,
      map: this.map,
    };
    this.fireToMap({ type: 'converted', eventName: 'remove', payload: eventData });
  }

  forwardFeatureUpdated(payload: GmEditFeatureUpdatedEvent) {
    const modeName = this.getConvertedEditModeName(payload.mode);
    const multiFeatureMode: Array<ModeName> = ['lasso'];
    const featuresPayload: FeatureUpdatedFwdEvent = {
      type: `${GM_PREFIX}:${modeName}`,
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

    this.fireToMap({ type: 'converted', eventName: `${modeName}`, payload: featuresPayload });
  }

  forwardFeatureEditStart(payload: GmEditFeatureEditStartEvent) {
    const modeName = this.getConvertedEditModeName(payload.mode);
    const eventData: FeatureEditStartFwdEvent = {
      type: `${GM_PREFIX}:${modeName}start`,
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
      type: `${GM_PREFIX}:${modeName}end`,
      actionType: payload.actionType,
      action: payload.action,
      shape: payload.feature.shape,
      feature: payload.feature,
      map: this.map,
    };
    this.fireToMap({ type: 'converted', eventName: `${modeName}end`, payload: eventData });
  }

  forwardGeomanLoaded(inputPayload: GmControlLoadEvent) {
    const payload: SystemFwdEvent = {
      type: `${GM_PREFIX}:${inputPayload.action}`,
      actionType: inputPayload.actionType,
      action: inputPayload.action,
      map: this.map,
      [GM_PREFIX]: this.gm,
    };

    this.fireToMap({
      type: 'converted',
      eventName: `${payload.action}`,
      payload,
    });
  }

  fireToMap({
    type,
    eventName,
    payload,
  }:
    | { type: 'system'; eventName: GmEventNameWithoutPrefix; payload: GmSystemEvent }
    | { type: 'converted'; eventName: GmFwdEventName; payload: GmEvent }): void {
    const prefix = type === 'system' ? GM_SYSTEM_PREFIX : GM_PREFIX;
    const eventNameWithPrefix = `${prefix}:${eventName}`;

    this.globalEventsListener?.(payload);
    this.gm.mapAdapter.fire(eventNameWithPrefix as AnyEventName, payload);
  }

  getConvertedEditModeName(mode: EditModeName): FwdEditModeName {
    return mode === 'change' ? 'edit' : mode;
  }
}
