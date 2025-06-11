import { gmPrefix } from '@/core/events/listeners/base.ts';
import type { FeatureData } from '@/core/features/feature-data.ts';
import type {
  ActionOptions,
  ActionType,
  AnyEvent,
  EditModeName,
  GeoJsonShapeFeature,
  Geoman,
  GMBeforeFeatureCreateEvent,
  GMBeforeFeatureUpdateEvent,
  GMGeofencingViolationEvent,
  MapEventHandlers,
  ModeName,
  NonEmptyArray,
  SubActions,
} from '@/main.ts';
import type { SnappingHelper } from '@/modes/helpers/snapping.ts';
import { isGmGeofencingViolationEvent } from '@/utils/guards/events/helper.ts';
import log from 'loglevel';


export const actionTypes = ['draw', 'edit', 'helper'] as const;

export abstract class BaseAction {
  gm: Geoman;
  abstract actionType: ActionType;
  abstract mode: ModeName;
  options: ActionOptions = [];
  actions: SubActions = [];
  flags = {
    featureCreateAllowed: true,
    featureUpdateAllowed: true,
  };

  abstract mapEventHandlers: MapEventHandlers;

  internalMapEventHandlers: MapEventHandlers = {
    [`${gmPrefix}:helper`]: this.handleHelperEvent.bind(this),
  };

  constructor(gm: Geoman) {
    this.gm = gm;
  }

  abstract onStartAction(): void;

  abstract onEndAction(): void;

  startAction() {
    this.gm.events.bus.attachEvents(this.internalMapEventHandlers);
    this.gm.events.bus.attachEvents(this.mapEventHandlers);
    this.onStartAction();
  }

  endAction() {
    this.onEndAction();
    this.gm.events.bus.detachEvents(this.mapEventHandlers);
    this.gm.events.bus.detachEvents(this.internalMapEventHandlers);
  }

  get snappingHelper(): SnappingHelper | null {
    return (
      this.gm.actionInstances.helper__snapping || null
    ) as SnappingHelper | null;
  }

  getOptionValue(name: string) {
    const option = this.options.find((item) => item.name === name);
    if (!option) {
      throw new Error(`Option ${name} not found`);
    }

    if (option.type === 'toggle') {
      return option.value;
    } else if (option.type === 'select') {
      return option.value.value;
    } else {
      throw new Error(`Unknown option type: ${JSON.stringify(option)}`);
    }
  }

  applyOptionValue(name: string, value: boolean | string | number) {
    const option = this.options.find((item) => item.name === name);
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
    } else {
      log.error('Can\'t apply option value', name, value, option);
    }
  }

  handleHelperEvent(event: AnyEvent) {
    if (isGmGeofencingViolationEvent(event)) {
      return this.handleGeofencingViolationEvent(event);
    }

    return { next: true };
  }

  handleGeofencingViolationEvent(event: GMGeofencingViolationEvent) {
    if (event.actionType === 'draw') {
      this.flags.featureCreateAllowed = false;
    } else if (event.actionType === 'edit') {
      this.flags.featureUpdateAllowed = false;
    }
    return { next: true };
  }

  fireBeforeFeatureCreate(
    { geoJsonFeatures, forceMode = undefined }: {
      geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>,
      forceMode?: EditModeName
    },
  ) {
    this.flags.featureCreateAllowed = true;

    const payload: GMBeforeFeatureCreateEvent = {
      level: 'system',
      type: this.actionType,
      mode: forceMode || this.mode,
      action: 'before_create',
      geoJsonFeatures,
    };
    this.gm.events.fire(`${gmPrefix}:${this.actionType}`, payload);
  }

  fireBeforeFeatureUpdate(
    { features, geoJsonFeatures, forceMode = undefined }: {
      features: NonEmptyArray<FeatureData>,
      geoJsonFeatures: NonEmptyArray<GeoJsonShapeFeature>,
      forceMode?: EditModeName
    },
  ) {
    this.flags.featureUpdateAllowed = true;

    const payload: GMBeforeFeatureUpdateEvent = {
      level: 'system',
      type: this.actionType,
      mode: forceMode || this.mode,
      action: 'before_update',
      features,
      geoJsonFeatures,
    };
    this.gm.events.fire(`${gmPrefix}:${this.actionType}`, payload);
  }
}
