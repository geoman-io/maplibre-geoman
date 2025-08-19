import { EventBus } from '@/core/events/bus.ts';
import { BaseEventListener, gmPrefix } from '@/core/events/listeners/base.ts';
import type { Geoman, GMEvent, EventHandlers } from '@/main.ts';
import { isGmControlEvent } from '@/utils/guards/events/control.ts';
import log from 'loglevel';


export class ControlEventListener extends BaseEventListener {
  eventHandlers: EventHandlers = {
    [`${gmPrefix}:control`]: this.handleControlEvent.bind(this),
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
