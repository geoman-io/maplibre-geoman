import { EventBus } from '@/core/events/bus.ts';
import { BaseEventListener } from '@/core/events/listeners/base.ts';
import { ControlEventListener } from '@/core/events/listeners/controls.ts';
import { DrawEventListener } from '@/core/events/listeners/draw.ts';
import { EditEventListener } from '@/core/events/listeners/edit.ts';
import { HelperEventListener } from '@/core/events/listeners/helper.ts';
import type { ActionType, Geoman } from '@/main.ts';
import log from 'loglevel';
import type { GmSystemEvent, GmEventName } from 'src/types/events';

export default class GmEvents {
  gm: Geoman;
  bus: EventBus;
  listeners: { [key in ActionType]?: BaseEventListener } = {};

  constructor(gm: Geoman) {
    this.gm = gm;
    this.bus = new EventBus(this.gm);

    this.listeners = {
      draw: new DrawEventListener(this.gm, this.bus),
      edit: new EditEventListener(this.gm, this.bus),
      helper: new HelperEventListener(this.gm, this.bus),
      control: new ControlEventListener(this.gm, this.bus),
    };
  }

  fire(eventName: GmEventName, payload: GmSystemEvent) {
    if (!this.listeners[payload.actionType]) {
      log.error(`Can't find event listener for "${payload.actionType}" event type`);
    }

    // events are sent to the bus and then are handler by the listeners
    // check events.bus.attachEvents() in required classes
    this.bus.fireEvent(eventName, payload);
  }
}
