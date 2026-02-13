import type { GmEvent, GmEventName, GmSystemEvent } from '@/types/events/index.ts';
import type { AnyEventName, MapEventName } from '@/types/map/index.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';

export type MapHandlerReturnData = { next: boolean };
export type MapEventHadler = (
  event: BaseMapEvent,
) => MapHandlerReturnData | Promise<MapHandlerReturnData>;
export type GmEventHadler = (
  event: GmSystemEvent,
) => MapHandlerReturnData | Promise<MapHandlerReturnData>;
export type AnyEventHandler = GmEventHadler | MapEventHadler;

export type EventHandlers = {
  [key in AnyEventName]?: AnyEventHandler;
};

export type MapEventHandlersWithControl = {
  [key in MapEventName]?: {
    controlHandler: (event: GmSystemEvent | GmEvent | BaseMapEvent) => Promise<void>;
    handlers: Array<AnyEventHandler>;
  };
};

export type GmEventHandlersWithControl = {
  [key in GmEventName]?: {
    controlHandler: (event: GmSystemEvent | GmEvent | BaseMapEvent) => Promise<void>;
    handlers: Array<AnyEventHandler>;
  };
};

export type EventControls =
  | GmEventHandlersWithControl[GmEventName]
  | MapEventHandlersWithControl[MapEventName];
