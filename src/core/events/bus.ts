import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { EventForwarder } from '@/core/events/forwarder.ts';
import type {
  AnyEventName,
  EventControls,
  EventHandlers,
  Geoman,
  GmEvent,
  GmEventHadler,
  GmEventHandlersWithControl,
  GmEventName,
  GmSystemEvent,
  MapEventHadler,
  MapEventHandlersWithControl,
  MapEventName,
} from '@/main.ts';
import { isBaseMapEvent, isGmEvent } from '@/utils/guards/events/index.ts';
import { typedKeys } from '@/utils/typing.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import log from 'loglevel';

export class EventBus {
  gm: Geoman;
  forwarder: EventForwarder;
  mapEventHandlers: MapEventHandlersWithControl = {};
  gmEventHandlers: GmEventHandlersWithControl = {};

  constructor(gm: Geoman) {
    this.gm = gm;
    this.forwarder = new EventForwarder(gm);
  }

  // Track pending event forwarding to maintain event ordering
  // Events are processed sequentially to ensure dragstart fires before drag, etc.
  private pendingForward: Promise<void> = Promise.resolve();

  async fireEvent(eventName: GmEventName, payload: GmSystemEvent) {
    const eventHandler = this.gmEventHandlers[eventName];
    if (!eventHandler) {
      return;
    }

    const { controlHandler } = eventHandler;
    await controlHandler(payload);

    // Chain event forwarding to maintain order
    // This ensures dragstart completes before drag events are forwarded
    this.pendingForward = this.pendingForward.then(() =>
      this.forwarder.processEvent(eventName, payload),
    );
  }

  attachEvents(handlers: EventHandlers) {
    typedKeys(handlers).forEach((eventName) => {
      const handler = handlers[eventName];
      if (handler) {
        this.on(eventName, handler);
      }
    });
  }

  detachEvents(handlers: EventHandlers) {
    typedKeys(handlers).forEach((eventName) => {
      const handler = handlers[eventName];
      if (handler) {
        this.off(eventName, handler);
      }
    });
  }

  detachAllEvents() {
    typedKeys(this.gmEventHandlers).forEach((gmEventName) => {
      const handlers = Array.from(this.gmEventHandlers[gmEventName]?.handlers || []);
      handlers.forEach((handler) => {
        this.off(gmEventName, handler);
      });
    });

    typedKeys(this.mapEventHandlers).forEach((mapEventName) => {
      const handlers = Array.from(this.mapEventHandlers[mapEventName]?.handlers || []);
      handlers.forEach((handler) => {
        this.off(mapEventName, handler);
      });
    });
  }

  on(eventName: AnyEventName, handler: MapEventHadler | GmEventHadler) {
    if (eventName.startsWith(GM_SYSTEM_PREFIX)) {
      this.onGmEvent(eventName as GmEventName, handler as GmEventHadler);
    } else {
      this.onMapEvent(eventName as MapEventName, handler as MapEventHadler);
    }
  }

  onGmEvent(eventName: GmEventName, handler: GmEventHadler) {
    if (!this.gmEventHandlers[eventName]) {
      this.gmEventHandlers[eventName] = this.createEventSection(eventName);
    }
    this.gmEventHandlers[eventName]?.handlers.unshift(handler);
  }

  onMapEvent(eventName: MapEventName, handler: MapEventHadler) {
    if (!this.mapEventHandlers[eventName]) {
      const eventSection = this.createEventSection(eventName);
      this.gm.mapAdapter.on(eventName, eventSection.controlHandler);
      this.mapEventHandlers[eventName] = eventSection;
    }
    this.mapEventHandlers[eventName]?.handlers.unshift(handler);
  }

  off(eventName: AnyEventName, handler: GmEventHadler | MapEventHadler) {
    if (eventName.startsWith(`${GM_SYSTEM_PREFIX}`)) {
      this.offGmEvent(eventName as GmEventName, handler as GmEventHadler);
    } else {
      this.offMapEvent(eventName as MapEventName, handler as MapEventHadler);
    }
  }

  offGmEvent(eventName: GmEventName, handler: GmEventHadler) {
    const eventHandlers = this.gmEventHandlers[eventName]?.handlers || [];
    const handlerIndex = eventHandlers.findIndex((handlerItem) => handler === handlerItem);

    if (handlerIndex === -1) {
      log.warn('MapEvents: handler not found', eventName, handler);
    } else {
      eventHandlers.splice(handlerIndex, 1);
      if (eventHandlers.length === 0) {
        delete this.gmEventHandlers[eventName];
      }
    }
  }

  offMapEvent(eventName: MapEventName, handler: MapEventHadler) {
    const eventHandlers = this.mapEventHandlers[eventName]?.handlers || [];
    const handlerIndex = eventHandlers.findIndex((handlerItem) => handler === handlerItem);

    if (handlerIndex === -1) {
      log.warn('MapEvents: handler not found', eventName, handler);
    } else {
      eventHandlers.splice(handlerIndex, 1);
      if (eventHandlers.length === 0) {
        const controlHandler = this.mapEventHandlers[eventName]?.controlHandler;
        if (controlHandler) {
          this.gm.mapAdapter.off(eventName, controlHandler);
        }
        delete this.mapEventHandlers[eventName];
      }
    }
  }

  createEventSection(eventName: MapEventName | GmEventName) {
    return {
      handlers: [],
      controlHandler: async (event: GmSystemEvent | GmEvent | BaseMapEvent) => {
        let eventHandler: EventControls;
        if (isGmEvent(event) && eventName.startsWith(`${GM_SYSTEM_PREFIX}`)) {
          eventHandler = this.gmEventHandlers[eventName as GmEventName];
        } else {
          eventHandler = this.mapEventHandlers[eventName as MapEventName];
        }
        if (!eventHandler) {
          log.debug(`No handlers for eventName: "${eventName}"`);
          return;
        }

        // controlHandler calls all handlers for the events type
        // note: here it's possible to have updated eventHandler.handlers on each iteration
        // to prevent errors we keep an original handlers for an event
        for (const handlerItem of [...eventHandler.handlers]) {
          let result;
          if (isGmEvent(event)) {
            result = await (handlerItem as GmEventHadler)(event);
          } else if (isBaseMapEvent(event)) {
            result = await (handlerItem as MapEventHadler)(event);
          } else {
            log.error('EventsBus: unknown event type', event);
          }

          if (result && typeof result === 'object' && 'next' in result) {
            // if handler returns "{next: false}", then don't call the next handler
            if (!result.next) break;
          } else {
            log.error('EventsBus: handler should return an object with a "next" property');
          }
        }
      },
    };
  }
}
