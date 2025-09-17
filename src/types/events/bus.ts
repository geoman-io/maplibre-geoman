import type { GMEvent, GmEventName } from '@/types/events/index.ts';
import type { AnyEvent, AnyEventName, MapEventName } from '@/types/map/index.ts';
import type { BaseMapAnyEvent } from '@mapLib/types/events.ts';

export type MapHandlerReturnData = { next: boolean };
export type MapEventHadler = (event: BaseMapAnyEvent) => MapHandlerReturnData;
export type GmEventHadler = (event: GMEvent) => MapHandlerReturnData;

export type EventHandlers = {
  [key in AnyEventName]?: GmEventHadler | MapEventHadler;
};

export type MapEventHandlersWithControl = {
  [key in MapEventName]?: {
    controlHandler: (event: AnyEvent) => void;
    handlers: Array<GmEventHadler | MapEventHadler>;
  };
};

export type GmEventHandlersWithControl = {
  [key in GmEventName]?: {
    controlHandler: (event: AnyEvent) => void;
    handlers: Array<GmEventHadler | MapEventHadler>;
  };
};

export type EventControls =
  | GmEventHandlersWithControl[GmEventName]
  | MapEventHandlersWithControl[MapEventName];
