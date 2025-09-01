import type {
  EditModeName,
  FeatureCreatedFwdEvent,
  FeatureEditStartFwdEvent,
  FeatureRemovedFwdEvent,
  FeatureUpdatedFwdEvent,
  FwdEditModeName,
  Geoman,
  GlobalEventsListener,
  GlobalEventsListenerParameters,
  GlobalModeToggledFwdEvent,
  GMControlLoadEvent,
  GMDrawModeEvent,
  GMDrawShapeCreatedEvent,
  GMEditFeatureEditEndEvent,
  GMEditFeatureEditStartEvent,
  GMEditFeatureRemovedEvent,
  GMEditFeatureUpdatedEvent,
  GMEditModeEvent,
  GMEvent,
  GmEventName,
  GmEventNameWithoutPrefix,
  GmFwdEventName,
  GmFwdEventNameWithPrefix,
  GmFwdSystemEventNameWithPrefix,
  GMHelperModeEvent,
  ModeName,
} from '@/main.ts';
import { GM_PREFIX } from '@/core/constants.ts';


export const gmSystemPrefix = `_${GM_PREFIX}`;

export class EventForwarder {
  gm: Geoman;
  globalEventsListener: GlobalEventsListener | null = null;

  constructor(gm: Geoman) {
    this.gm = gm;
  }

  get map() {
    return this.gm.mapAdapter.getMapInstance();
  }

  processEvent(eventName: GmEventName, payload: GMEvent) {
    // repeat the events to the map to allow end users to listen
    this.fireToMap(
      'system',
      eventName.split(':')[1] as GmEventNameWithoutPrefix,
      { ...payload, level: 'user' },
    );

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

  forwardModeToggledEvent(payload: GMDrawModeEvent | GMEditModeEvent | GMHelperModeEvent) {
    const enabled = payload.action === 'mode_start';
    let eventData: GlobalModeToggledFwdEvent;

    if (payload.type === 'draw') {
      // global draw mode toggled
      const eventName = 'globaldrawmodetoggled';
      eventData = { enabled, shape: payload.mode, map: this.map };
      this.fireToMap('converted', eventName, eventData);

      // drawstart, drawend
      eventData = { shape: payload.mode, map: this.map };
      this.fireToMap('converted', enabled ? 'drawstart' : 'drawend', eventData);
    } else if (payload.type === 'edit') {
      const modeName = this.getConvertedEditModeName(payload.mode);
      eventData = { enabled, map: this.map };
      this.fireToMap('converted', `global${modeName}modetoggled`, eventData);
    } else if (payload.type === 'helper') {
      eventData = { enabled, map: this.map };
      this.fireToMap('converted', `global${payload.mode}modetoggled`, eventData);
    }
  }

  forwardFeatureCreated(payload: GMDrawShapeCreatedEvent) {
    const eventData: FeatureCreatedFwdEvent = {
      shape: payload.mode,
      feature: payload.featureData,
      map: this.map,
    };
    this.fireToMap('converted', 'create', eventData);
  }

  forwardFeatureRemoved(payload: GMEditFeatureRemovedEvent) {
    const eventData: FeatureRemovedFwdEvent = {
      shape: payload.mode,
      feature: payload.featureData,
      map: this.map,
    };
    this.fireToMap('converted', 'remove', eventData);
  }

  forwardFeatureUpdated(payload: GMEditFeatureUpdatedEvent) {
    const multiFeatureMode: Array<ModeName> = ['lasso'];
    const featuresPayload: FeatureUpdatedFwdEvent = {
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
    this.fireToMap('converted', `${modeName}`, featuresPayload);
  }

  forwardFeatureEditStart(payload: GMEditFeatureEditStartEvent) {
    const modeName = this.getConvertedEditModeName(payload.mode);
    const eventData: FeatureEditStartFwdEvent = {
      shape: payload.feature.shape,
      feature: payload.feature,
      map: this.map,
    };
    this.fireToMap('converted', `${modeName}start`, eventData);
  }

  forwardFeatureEditEnd(payload: GMEditFeatureEditEndEvent) {
    const modeName = this.getConvertedEditModeName(payload.mode);
    const eventData: FeatureEditStartFwdEvent = {
      shape: payload.feature.shape,
      feature: payload.feature,
      map: this.map,
    };
    this.fireToMap('converted', `${modeName}end`, eventData);
  }

  forwardGeomanLoaded(payload: GMControlLoadEvent) {
    this.fireToMap(
      'converted',
      `${payload.action}`,
      { map: this.map, [GM_PREFIX]: this.gm },
    );
  }

  fireToMap(
    type: GlobalEventsListenerParameters['type'],
    eventName: GmEventNameWithoutPrefix | GmFwdEventName,
    payload: GlobalEventsListenerParameters['payload'],
  ) {
    const prefix = type === 'system' ? gmSystemPrefix : GM_PREFIX;
    const eventNameWithPrefix = `${prefix}:${eventName}` as GmFwdEventNameWithPrefix | GmFwdSystemEventNameWithPrefix;

    if (this.globalEventsListener) {
      this.globalEventsListener({ type, name: eventNameWithPrefix, payload });
    }
    this.gm.mapAdapter.fire(eventNameWithPrefix, payload);
  }

  getConvertedEditModeName(mode: EditModeName): FwdEditModeName {
    return mode === 'change' ? 'edit' : mode;
  }
}
