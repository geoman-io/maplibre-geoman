import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { EventBus } from '@/core/events/bus.ts';
import { BaseEventListener } from '@/core/events/listeners/base.ts';
import type {
  ActionInstanceKey,
  EventHandlers,
  Geoman,
  GmEditEvent,
  GmSystemEvent,
} from '@/main.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { createEditInstance } from '@/modes/edit/index.ts';
import { isGmEditEvent } from '@/utils/guards/modes.ts';
import log from 'loglevel';

export class EditEventListener extends BaseEventListener {
  eventHandlers: EventHandlers = {
    [`${GM_SYSTEM_PREFIX}:edit`]: this.handleEditEvent.bind(this),
  };

  constructor(gm: Geoman, bus: EventBus) {
    super(gm);
    bus.attachEvents(this.eventHandlers);
  }

  async handleEditEvent(payload: GmSystemEvent) {
    if (!isGmEditEvent(payload)) {
      return { next: true };
    }

    const actionInstanceKey: ActionInstanceKey = `${payload.actionType}__${payload.mode}`;
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

  async start(actionInstanceKey: ActionInstanceKey, payload: GmEditEvent) {
    if (payload.action !== 'mode_start') {
      return;
    }

    const actionInstance = createEditInstance(this.gm, payload.mode);
    if (!actionInstance) {
      return;
    }
    const controlOptions = this.getControlOptions(payload);
    if (controlOptions?.settings) {
      actionInstance.settings = controlOptions.settings;
    }

    if (actionInstanceKey in this.gm.actionInstances) {
      log.error(`Action instance "${actionInstanceKey}" already exists`);
    }

    this.gm.actionInstances[actionInstanceKey] = actionInstance;
    await actionInstance.startAction();
  }

  async end(actionInstanceKey: ActionInstanceKey) {
    const actionInstance = this.gm.actionInstances[actionInstanceKey];

    if (actionInstance instanceof BaseEdit) {
      await actionInstance.endAction();
      delete this.gm.actionInstances[actionInstanceKey];
    } else {
      console.error(
        `Wrong action instance for edit event "${actionInstanceKey}": `,
        actionInstance,
      );
    }
  }
}
