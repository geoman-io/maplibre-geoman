import { EventBus } from '@/core/events/bus.ts';
import { BaseEventListener, gmPrefix } from '@/core/events/listeners/base.ts';
import type { ActionInstanceKey, Geoman, GMEditEvent, GMEvent, MapEventHandlers } from '@/main.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { isGmEditEvent } from '@/utils/guards/modes.ts';
import log from 'loglevel';


export class EditEventListener extends BaseEventListener {
  mapEventHandlers: MapEventHandlers = {
    [`${gmPrefix}:edit`]: this.handleEditEvent.bind(this),
  };

  constructor(gm: Geoman, bus: EventBus) {
    super(gm);
    bus.attachEvents(this.mapEventHandlers);
  }

  handleEditEvent(payload: GMEvent) {
    if (!isGmEditEvent(payload)) {
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

  start(actionInstanceKey: ActionInstanceKey, payload: GMEditEvent) {
    if (payload.action !== 'mode_start') {
      return;
    }

    const actionInstance = this.gm.createEditInstance(payload.mode);
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
