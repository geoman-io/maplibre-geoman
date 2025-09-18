import { EventForwarder } from '@/core/events/forwarder.ts';
import type {
  AnyEvent,
  AnyEventName,
  EventControls,
  EventHandlers,
  Geoman,
  GmEvent,
  GmEventHadler,
  GmEventHandlersWithControl,
  GmEventName,
  MapEventHadler,
  MapEventHandlersWithControl,
  MapEventName,
} from '@/main.ts';
import { isBaseMapEvent, isGmEvent } from '@/utils/guards/events/index.ts';
import { typedKeys } from '@/utils/typing.ts';
import log from 'loglevel';
import { GM_PREFIX } from '@/core/constants.ts';

export class EventBus {
  gm: Geoman;
  forwarder: EventForwarder;
  mapEventHandlers: MapEventHandlersWithControl = {};
  gmEventHandlers: GmEventHandlersWithControl = {};

  constructor(gm: Geoman) {
    this.gm = gm;
    this.forwarder = new EventForwarder(gm);
  }

  fireEvent(eventName: GmEventName, payload: GmEvent) {
    const eventHandler = this.gmEventHandlers[eventName];
    if (!eventHandler) {
      return;
    }

    const { controlHandler } = eventHandler;
    controlHandler(payload);

    // make events available for end users
    this.forwarder.processEvent(eventName, payload);
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
    if (eventName.startsWith(GM_PREFIX)) {
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
    if (eventName.startsWith(`${GM_PREFIX}`)) {
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
      controlHandler: (event: AnyEvent) => {
        let eventHandler: EventControls;
        if (isGmEvent(event) && eventName.startsWith(`${GM_PREFIX}`)) {
          eventHandler = this.gmEventHandlers[eventName as GmEventName];
        } else {
          eventHandler = this.mapEventHandlers[eventName as MapEventName];
        }
        if (!eventHandler) {
          log.debug(`No handlers for eventName: "${eventName}"`);
          return;
        }

        // controlHandler calls all handlers for the events type
        eventHandler.handlers.some((handlerItem: GmEventHadler | MapEventHadler) => {
          let result;
          if (isGmEvent(event)) {
            result = (handlerItem as GmEventHadler)(event);
          } else if (isBaseMapEvent(event)) {
            result = (handlerItem as MapEventHadler)(event);
          } else {
            log.error('EventsBus: unknown event type', event);
          }

          if (result && typeof result === 'object' && 'next' in result) {
            // if handler returns "{next: false}", then don't call the next handler
            return !result.next; // true means "stop calling the next handlers" here
          } else {
            log.error('EventsBus: handler should return an object with a "next" property');
            return false; // don't prevent the next handler
          }
        });
      },
    };
  }
}
