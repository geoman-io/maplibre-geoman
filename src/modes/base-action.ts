import type { FeatureData } from '@/core/features/feature-data.ts';
import type {
  ActionOptions,
  ActionSettings,
  ActionType,
  AnyEvent,
  EditModeName,
  EventHandlers,
  GeoJsonShapeFeature,
  Geoman,
  GmBeforeFeatureCreateEvent,
  GmBeforeFeatureUpdateEvent,
  GmGeofencingViolationEvent,
  ModeName,
  NonEmptyArray,
  SubActions,
} from '@/main.ts';
import type { SnappingHelper } from '@/modes/helpers/snapping.ts';
import { isGmGeofencingViolationEvent } from '@/utils/guards/events/helper.ts';
import log from 'loglevel';
import { GM_PREFIX } from '@/core/constants.ts';

export abstract class BaseAction {
  gm: Geoman;
  abstract actionType: ActionType;
  abstract mode: ModeName;
  options: ActionOptions = {};
  settings: ActionSettings = {};
  actions: SubActions = {};
  flags = {
    featureCreateAllowed: true,
    featureUpdateAllowed: true,
    actionInProgress: false,
  };

  abstract eventHandlers: EventHandlers;

  internalEventHandlers: EventHandlers = {
    [`${GM_PREFIX}:helper`]: this.handleHelperEvent.bind(this),
  };

  constructor(gm: Geoman) {
    this.gm = gm;
  }

  get snappingHelper(): SnappingHelper | null {
    return (this.gm.actionInstances.helper__snapping || null) as SnappingHelper | null;
  }

  abstract onStartAction(): void;

  abstract onEndAction(): void;

  startAction() {
    this.gm.events.bus.attachEvents(this.internalEventHandlers);
    this.gm.events.bus.attachEvents(this.eventHandlers);
    this.onStartAction();
  }

  endAction() {
    this.onEndAction();
    this.gm.events.bus.detachEvents(this.eventHandlers);
    this.gm.events.bus.detachEvents(this.internalEventHandlers);
  }

  getOptionValue(name: string) {
    const option = this.options[name];
    if (!option) {
      throw new Error(`Option ${name} not found`);
    }

    if (['toggle', 'hidden'].includes(option.type)) {
      return option.value;
    } else if (option.type === 'select') {
      return option.value.value;
    } else {
      throw new Error(`Unknown option type: ${JSON.stringify(option)}`);
    }
  }

  getSettingValue(name: string) {
    if (name in this.settings) {
      return this.settings[name];
    }
    return undefined;
  }

  applyOptionValue(name: string, value: boolean | string | number) {
    const option = this.options[name];
    if (!option) {
      log.error('Option not found', name, value);
      return;
    }

    if (option.type === 'toggle' && typeof value === 'boolean') {
      option.value = value;
    } else if (option.type === 'select') {
      const choiceItemValue = option.choices.find((item) => item.value === value);
      if (choiceItemValue) {
        option.value = choiceItemValue;
      }
    } else if (option.type === 'hidden') {
      option.value = value;
    } else {
      log.error("Can't apply option value", name, value, option);
    }
  }

  handleHelperEvent(event: AnyEvent) {
    if (isGmGeofencingViolationEvent(event)) {
      return this.handleGeofencingViolationEvent(event);
    }

    return { next: true };
  }

  handleGeofencingViolationEvent(event: GmGeofencingViolationEvent) {
    if (event.actionType === 'draw') {
      this.flags.featureCreateAllowed = false;
    } else if (event.actionType === 'edit') {
      this.flags.featureUpdateAllowed = false;
    }
    return { next: true };
  }

  fireBeforeFeatureCreate({
    geoJsonFeatures,
    forceMode = undefined,
  }: {
    geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>;
    forceMode?: EditModeName;
  }) {
    this.flags.featureCreateAllowed = true;

    const payload: GmBeforeFeatureCreateEvent = {
      level: 'system',
      actionType: this.actionType,
      mode: forceMode || this.mode,
      action: 'before_create',
      geoJsonFeatures,
    };
    this.gm.events.fire(`${GM_PREFIX}:${this.actionType}`, payload);
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
      actionType: this.actionType,
      mode: forceMode || this.mode,
      action: 'before_update',
      features,
      geoJsonFeatures,
    };
    this.gm.events.fire(`${GM_PREFIX}:${this.actionType}`, payload);
  }
}
