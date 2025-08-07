import { EventBus } from '@/core/events/bus.ts';
import { BaseEventListener, gmPrefix } from '@/core/events/listeners/base.ts';
import type { ActionInstanceKey, Geoman, GMEvent, GMHelperModeEvent, MapEventHandlers } from '@/main.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';
import { createHelperInstance } from '@/modes/helpers/index.ts';
import { isGmHelperEvent } from '@/utils/guards/events/helper.ts';
import log from 'loglevel';


export class HelperEventListener extends BaseEventListener {
  mapEventHandlers: MapEventHandlers = {
    [`${gmPrefix}:helper`]: this.handleHelperEvent.bind(this),
  };

  constructor(gm: Geoman, bus: EventBus) {
    super(gm);
    bus.attachEvents(this.mapEventHandlers);
  }

  handleHelperEvent(payload: GMEvent) {
    if (!isGmHelperEvent(payload)) {
      return { next: true };
    }

    const actionInstanceKey: ActionInstanceKey = `${payload.type}__${payload.mode}`;

    if (payload.action === 'mode_start') {
      this.trackExclusiveModes(payload);
      this.start(actionInstanceKey, payload);
      this.trackRelatedModes(payload);
    } else if (payload.action === 'mode_end') {
      this.trackRelatedModes(payload);
      this.end(actionInstanceKey);
    }

    return { next: true };
  }

  start(actionInstanceKey: ActionInstanceKey, payload: GMHelperModeEvent) {
    const actionInstance = createHelperInstance(this.gm, payload.mode);
    if (!actionInstance) {
      return;
    }

    if (actionInstanceKey in this.gm.actionInstances) {
      log.error(`Action instance "${actionInstanceKey}" already exists`);
    }

    this.gm.actionInstances[actionInstanceKey] = actionInstance;
    actionInstance.startAction();
  }

  end(actionInstanceKey: ActionInstanceKey) {
    const actionInstance = this.gm.actionInstances[actionInstanceKey];
    if (actionInstance instanceof BaseHelper) {
      actionInstance.endAction();
      delete this.gm.actionInstances[actionInstanceKey];
    } else {
      console.error(
        `Wrong action instance for edit event "${actionInstanceKey}":`,
        actionInstance,
      );
    }
  }
}
