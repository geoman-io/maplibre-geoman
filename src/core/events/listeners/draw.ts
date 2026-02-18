import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { EventBus } from '@/core/events/bus.ts';
import { BaseEventListener } from '@/core/events/listeners/base.ts';
import type {
  ActionInstanceKey,
  EventHandlers,
  Geoman,
  GmDrawEvent,
  GmSystemEvent,
} from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { createDrawInstance } from '@/modes/draw/index.ts';
import { isGmDrawEvent } from '@/utils/guards/modes.ts';
import log from 'loglevel';

export class DrawEventListener extends BaseEventListener {
  eventHandlers: EventHandlers = {
    [`${GM_SYSTEM_PREFIX}:draw`]: this.handleDrawEvent.bind(this),
  };

  constructor(gm: Geoman, bus: EventBus) {
    super(gm);
    bus.attachEvents(this.eventHandlers);
  }

  async handleDrawEvent(payload: GmSystemEvent) {
    if (!isGmDrawEvent(payload)) {
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

  async start(actionInstanceKey: ActionInstanceKey, payload: GmDrawEvent) {
    const actionInstance = createDrawInstance(this.gm, payload.mode);
    if (!actionInstance) {
      return;
    }

    if (actionInstanceKey in this.gm.actionInstances) {
      log.error(`Action instance "${actionInstanceKey}" already exists`);
    }

    this.gm.actionInstances[actionInstanceKey] = actionInstance;
    await actionInstance.startAction();
  }

  async end(actionInstanceKey: ActionInstanceKey) {
    const actionInstance = this.gm.actionInstances[actionInstanceKey];
    if (actionInstance instanceof BaseDraw) {
      await actionInstance.endAction();
      delete this.gm.actionInstances[actionInstanceKey];
    } else {
      console.error(`Wrong action instance for draw event "${actionInstanceKey}":`, actionInstance);
    }
  }
}
