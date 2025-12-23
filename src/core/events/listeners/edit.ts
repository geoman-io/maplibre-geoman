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

  handleEditEvent(payload: GmSystemEvent) {
    if (!isGmEditEvent(payload) || !payload.mode) {
      return { next: true };
    }

    const actionInstanceKey: ActionInstanceKey = `${payload.actionType}__${payload.mode}`;
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

  start(actionInstanceKey: ActionInstanceKey, payload: GmEditEvent) {
    if (payload.action !== 'mode_start') {
      return;
    }

    const actionInstance = createEditInstance(this.gm, payload.mode);
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

    if (actionInstance instanceof BaseEdit) {
      actionInstance.endAction();
      delete this.gm.actionInstances[actionInstanceKey];
    } else {
      console.error(
        `Wrong action instance for edit event "${actionInstanceKey}": `,
        actionInstance,
      );
    }
  }
}
