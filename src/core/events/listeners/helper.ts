import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { EventBus } from '@/core/events/bus.ts';
import { BaseEventListener } from '@/core/events/listeners/base.ts';
import type {
  ActionInstanceKey,
  EventHandlers,
  Geoman,
  GmHelperModeEvent,
  GmSystemEvent,
} from '@/main.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';
import { createHelperInstance } from '@/modes/helpers/index.ts';
import { isGmHelperEvent } from '@/utils/guards/events/helper.ts';
import log from 'loglevel';

export class HelperEventListener extends BaseEventListener {
  eventHandlers: EventHandlers = {
    [`${GM_SYSTEM_PREFIX}:helper`]: this.handleHelperEvent.bind(this),
  };

  constructor(gm: Geoman, bus: EventBus) {
    super(gm);
    bus.attachEvents(this.eventHandlers);
    log.debug(bus.mapEventHandlers);
    log.debug(bus.gmEventHandlers);
  }

  async handleHelperEvent(payload: GmSystemEvent) {
    if (!isGmHelperEvent(payload)) {
      return { next: true };
    }

    const actionInstanceKey: ActionInstanceKey = `${payload.actionType}__${payload.mode}`;
    // log.trace('HelperEventListener.handleHelperEvent', actionInstanceKey, payload.action);

    if (payload.action === 'mode_start') {
      await this.trackExclusiveModes(payload);
      await this.start(actionInstanceKey, payload);
      await this.trackRelatedModes(payload);
    } else if (payload.action === 'mode_end') {
      await this.trackRelatedModes(payload);
      await this.end(actionInstanceKey);
    }

    return { next: true };
  }

  async start(actionInstanceKey: ActionInstanceKey, payload: GmHelperModeEvent) {
    const actionInstance = createHelperInstance(this.gm, payload.mode);
    if (!actionInstance) {
      return;
    }

    if (actionInstanceKey in this.gm.actionInstances) {
      log.error(`Action instance "${actionInstanceKey}" already exists`);
      throw new Error('Action instance already exists');
    }

    this.gm.actionInstances[actionInstanceKey] = actionInstance;
    await actionInstance.startAction();
    log.debug('started', actionInstanceKey);
  }

  async end(actionInstanceKey: ActionInstanceKey) {
    const actionInstance = this.gm.actionInstances[actionInstanceKey];
    if (actionInstance instanceof BaseHelper) {
      await actionInstance.endAction();
      delete this.gm.actionInstances[actionInstanceKey];
    } else {
      console.error(`Wrong action instance for edit event "${actionInstanceKey}":`, actionInstance);
    }
  }
}
