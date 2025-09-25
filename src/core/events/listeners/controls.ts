import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { EventBus } from '@/core/events/bus.ts';
import { BaseEventListener } from '@/core/events/listeners/base.ts';
import type { EventHandlers, Geoman, GmEvent } from '@/main.ts';
import { isGmControlEvent } from '@/utils/guards/events/control.ts';
import log from 'loglevel';

export class ControlEventListener extends BaseEventListener {
  eventHandlers: EventHandlers = {
    [`${GM_SYSTEM_PREFIX}:control`]: this.handleControlEvent.bind(this),
  };

  constructor(gm: Geoman, bus: EventBus) {
    super(gm);
    bus.attachEvents(this.eventHandlers);
  }

  handleControlEvent(payload: GmEvent) {
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
