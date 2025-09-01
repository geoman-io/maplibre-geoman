import { EventBus } from '@/core/events/bus.ts';
import { BaseEventListener } from '@/core/events/listeners/base.ts';
import type { Geoman, GMEvent, EventHandlers } from '@/main.ts';
import { isGmControlEvent } from '@/utils/guards/events/control.ts';
import log from 'loglevel';
import { GM_PREFIX } from '@/core/constants.ts';


export class ControlEventListener extends BaseEventListener {
  eventHandlers: EventHandlers = {
    [`${GM_PREFIX}:control`]: this.handleControlEvent.bind(this),
  };

  constructor(gm: Geoman, bus: EventBus) {
    super(gm);
    bus.attachEvents(this.eventHandlers);
  }

  handleControlEvent(payload: GMEvent) {
    // doesn't handle loaded/unloaded control events
    if (!isGmControlEvent(payload)) {
      return { next: true };
    }

    const control = this.getControl(payload);
    if (!control) {
      log.error('Control not found, event payload', payload);
    }
    return { next: true };
  }
}
