import { GM_PREFIX, GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import type { Geoman } from '@/main.ts';
import type { ModeName } from '@/types/controls.ts';
import type { GmControlLoadEvent } from '@/types/events/control.ts';
import type { GmDrawFeatureCreatedEvent, GmDrawModeEvent } from '@/types/events/draw.ts';
import type {
  GmEditFeatureEditEndEvent,
  GmEditFeatureEditStartEvent,
  GmEditFeatureRemovedEvent,
  GmEditFeatureUpdatedEvent,
  GmEditModeEvent,
  GmEditSelectionChangeEvent,
} from '@/types/events/edit.ts';
import type {
  FeatureEditEndFwdEvent,
  FeatureEditStartFwdEvent,
  FwdEditModeName,
  SelectionChangedFwdEvent,
} from '@/types/events/forwarder/edit.ts';
import type {
  FeatureCreatedFwdEvent,
  FeatureRemovedFwdEvent,
  FeatureUpdatedFwdEvent,
} from '@/types/events/forwarder/features.ts';
import type {
  GmEvent,
  GmFwdEventName,
  GlobalEventsListener,
} from '@/types/events/forwarder/index.ts';
import type {
  GlobalDrawEnabledDisabledFwdEvent,
  GlobalDrawToggledFwdEvent,
  GlobalEditToggledFwdEvent,
  GlobalHelperToggledFwdEvent,
} from '@/types/events/forwarder/mode.ts';
import type { SystemFwdEvent } from '@/types/events/forwarder/system.ts';
import type { GmHelperModeEvent } from '@/types/events/helper.ts';
import type { GmEventName, GmEventNameWithoutPrefix, GmSystemEvent } from '@/types/events/index.ts';
import type { FeatureSourceName } from '@/types/features.ts';
import type { AnyEventName } from '@/types/map/index.ts';
import type { EditModeName } from '@/types/modes/index.ts';

export class EventForwarder {
  gm: Geoman;
  globalEventsListener: GlobalEventsListener | null = null;

  constructor(gm: Geoman) {
    this.gm = gm;
  }

  get map() {
    return this.gm.mapAdapter.getMapInstance();
  }

  async processEvent(eventName: GmEventName, payload: GmSystemEvent) {
    // repeat the events to the map to allow end users to listen
    await this.fireToMap({
      type: 'system',
      eventName: eventName.split(':')[1] as GmEventNameWithoutPrefix,
      payload: {
        ...payload,
        level: 'user',
      },
    });

    if (payload.action === 'mode_start' || payload.action === 'mode_end') {
      await this.forwardModeToggledEvent(payload);
    } else if (payload.action === 'feature_created') {
      await this.forwardFeatureCreated(payload);
    } else if (payload.action === 'feature_removed') {
      await this.forwardFeatureRemoved(payload);
    } else if (payload.action === 'feature_updated') {
      await this.forwardFeatureUpdated(payload);
    } else if (payload.action === 'feature_edit_start') {
      await this.forwardFeatureEditStart(payload);
    } else if (payload.action === 'feature_edit_end') {
      await this.forwardFeatureEditEnd(payload);
    } else if (payload.action === 'selection_change') {
      await this.forwardSelectionChanged(payload);
    } else if (payload.action === 'loaded' || payload.action === 'unloaded') {
      await this.forwardGeomanLoaded(payload);
    }
  }

  async forwardModeToggledEvent(payload: GmDrawModeEvent | GmEditModeEvent | GmHelperModeEvent) {
    const enabled = payload.action === 'mode_start';

    if (payload.actionType === 'draw') {
      // global draw mode toggled
      const eventName = 'globaldrawmodetoggled';
      const eventData: GlobalDrawToggledFwdEvent = {
        name: `${GM_PREFIX}:${eventName}`,
        actionType: payload.actionType,
        action: payload.action,
        enabled,
        shape: payload.mode,
        map: this.map,
      };
      await this.fireToMap({ type: 'converted', eventName, payload: eventData });

      // drawstart, drawend
      const eventName2 = enabled ? 'drawstart' : 'drawend';
      const eventData2: GlobalDrawEnabledDisabledFwdEvent = {
        name: `${GM_PREFIX}:${eventName2}`,
        actionType: payload.actionType,
        action: payload.action,
        shape: payload.mode,
        map: this.map,
      };
      await this.fireToMap({
        type: 'converted',
        eventName: eventName2,
        payload: eventData2,
      });
    } else if (payload.actionType === 'edit') {
      const modeName = this.getConvertedEditModeName(payload.mode);
      const eventName = `global${modeName}modetoggled` as const;
      const eventData: GlobalEditToggledFwdEvent = {
        name: `${GM_PREFIX}:${eventName}`,
        actionType: payload.actionType,
        action: payload.action,
        enabled,
        map: this.map,
      };
      await this.fireToMap({
        type: 'converted',
        eventName,
        payload: eventData,
      });
    } else if (payload.actionType === 'helper') {
      const eventName = `global${payload.mode}modetoggled` as const;
      const eventData: GlobalHelperToggledFwdEvent = {
        name: `${GM_PREFIX}:${eventName}`,
        actionType: payload.actionType,
        action: payload.action,
        enabled,
        map: this.map,
      };
      await this.fireToMap({
        type: 'converted',
        eventName,
        payload: eventData,
      });
    }
  }

  async forwardFeatureCreated(payload: GmDrawFeatureCreatedEvent) {
    const eventData: FeatureCreatedFwdEvent = {
      name: `${GM_PREFIX}:create`,
      actionType: payload.actionType,
      action: payload.action,
      shape: payload.mode,
      feature: payload.featureData,
      map: this.map,
    };
    await this.fireToMap({ type: 'converted', eventName: 'create', payload: eventData });
  }

  async forwardFeatureRemoved(payload: GmEditFeatureRemovedEvent) {
    const eventData: FeatureRemovedFwdEvent = {
      name: `${GM_PREFIX}:remove`,
      actionType: payload.actionType,
      action: payload.action,
      shape: payload.mode,
      feature: payload.featureData,
      map: this.map,
    };
    await this.fireToMap({ type: 'converted', eventName: 'remove', payload: eventData });
  }

  async forwardFeatureUpdated(payload: GmEditFeatureUpdatedEvent) {
    const modeName = this.getConvertedEditModeName(payload.mode);
    const multiFeatureMode: Array<ModeName> = ['lasso'];
    const featuresPayload: FeatureUpdatedFwdEvent = {
      name: `${GM_PREFIX}:${modeName}`,
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

    await this.fireToMap({ type: 'converted', eventName: `${modeName}`, payload: featuresPayload });
  }

  async forwardFeatureEditStart(payload: GmEditFeatureEditStartEvent) {
    const modeName = this.getConvertedEditModeName(payload.mode);
    const eventData: FeatureEditStartFwdEvent = {
      name: `${GM_PREFIX}:${modeName}start`,
      actionType: payload.actionType,
      action: payload.action,
      shape: payload.feature.shape,
      feature: payload.feature,
      map: this.map,
    };
    await this.fireToMap({ type: 'converted', eventName: `${modeName}start`, payload: eventData });
  }

  async forwardFeatureEditEnd(payload: GmEditFeatureEditEndEvent) {
    const modeName = this.getConvertedEditModeName(payload.mode);
    const eventData: FeatureEditEndFwdEvent = {
      name: `${GM_PREFIX}:${modeName}end`,
      actionType: payload.actionType,
      action: payload.action,
      shape: payload.feature.shape,
      feature: payload.feature,
      map: this.map,
    };
    await this.fireToMap({ type: 'converted', eventName: `${modeName}end`, payload: eventData });
  }

  async forwardSelectionChanged(payload: GmEditSelectionChangeEvent) {
    const eventData: SelectionChangedFwdEvent = {
      name: `${GM_PREFIX}:selection`,
      actionType: payload.actionType,
      action: payload.action,
      selection: payload.selection,
      map: this.map,
    };
    await this.fireToMap({ type: 'converted', eventName: 'selection', payload: eventData });
  }

  async forwardGeomanLoaded(inputPayload: GmControlLoadEvent) {
    const payload: SystemFwdEvent = {
      name: `${GM_PREFIX}:${inputPayload.action}`,
      actionType: inputPayload.actionType,
      action: inputPayload.action,
      map: this.map,
      [GM_PREFIX]: this.gm,
    };

    await this.fireToMap({
      type: 'converted',
      eventName: `${payload.action}`,
      payload,
    });
  }

  async fireToMap({
    type,
    eventName,
    payload,
  }:
    | { type: 'system'; eventName: GmEventNameWithoutPrefix; payload: GmSystemEvent }
    | { type: 'converted'; eventName: GmFwdEventName; payload: GmEvent }): Promise<void> {
    const prefix = type === 'system' ? GM_SYSTEM_PREFIX : GM_PREFIX;
    const eventNameWithPrefix = `${prefix}:${eventName}`;

    // Wait for pending source updates when the setting is enabled and
    // the payload contains a feature with a source. This ensures feature
    // data is accessible in event handlers via exportGeoJson().
    // Users can disable this via settings.awaitDataUpdatesOnEvents for faster async updates.
    const shouldAwaitUpdates =
      this.gm.options.settings.awaitDataUpdatesOnEvents &&
      'feature' in payload &&
      payload.feature?.source;

    if (shouldAwaitUpdates) {
      // Wait for MapLibre to commit pending data updates before firing the event
      const sourceName = payload.feature!.source.id as FeatureSourceName;
      await this.gm.features.updateManager.waitForPendingUpdates(sourceName);
    }

    this.globalEventsListener?.(payload);
    this.gm.mapAdapter.fire(eventNameWithPrefix as AnyEventName, payload);
  }

  getConvertedEditModeName(mode: EditModeName): FwdEditModeName {
    return mode === 'change' ? 'edit' : mode;
  }
}
