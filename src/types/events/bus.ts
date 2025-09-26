import type { GmEvent, GmEventName, GmSystemEvent } from '@/types/events/index.ts';
import type { AnyEventName, MapEventName } from '@/types/map/index.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';

export type MapHandlerReturnData = { next: boolean };
export type MapEventHadler = (event: BaseMapEvent) => MapHandlerReturnData;
export type GmEventHadler = (event: GmSystemEvent) => MapHandlerReturnData;

export type EventHandlers = {
  [key in AnyEventName]?: GmEventHadler | MapEventHadler;
};

export type MapEventHandlersWithControl = {
  [key in MapEventName]?: {
    controlHandler: (event: GmSystemEvent | GmEvent | BaseMapEvent) => void;
    handlers: Array<GmEventHadler | MapEventHadler>;
  };
};

export type GmEventHandlersWithControl = {
  [key in GmEventName]?: {
    controlHandler: (event: GmSystemEvent | GmEvent | BaseMapEvent) => void;
    handlers: Array<GmEventHadler | MapEventHadler>;
  };
};

export type EventControls =
  | GmEventHandlersWithControl[GmEventName]
  | MapEventHandlersWithControl[MapEventName];
