import type { GmControlLoadEvent } from '@/types/events/control.ts';
import type { FeatureEditFwdEvent, FwdEditModeName } from '@/types/events/forwarder/edit.ts';
import type { FeatureFwdEvent } from '@/types/events/forwarder/features.ts';
import type { GlobalModeToggledFwdEvent } from '@/types/events/forwarder/mode.ts';
import type { SystemFwdEvent } from '@/types/events/forwarder/system.ts';
import type {
  GmSystemEvent,
  GmEventNameWithoutPrefix,
  GmPrefix,
  GmSystemPrefix,
} from '@/types/events/index.ts';
import type { HelperModeName } from '@/types/modes/index.ts';

export type GmFwdEventNameWithPrefix = `${GmPrefix}:${GmFwdEventName}`;
export type GmFwdSystemEventNameWithPrefix = `${GmSystemPrefix}:${GmEventNameWithoutPrefix}`;
export type GlobalEventsListener = (event: GmSystemEvent | GmEvent) => void;

export type GmFwdEventName =
  | 'globaldrawmodetoggled'
  | 'drawstart'
  | 'drawend'
  | `global${FwdEditModeName}modetoggled`
  | `global${HelperModeName}modetoggled`
  | 'create'
  | 'remove'
  | 'selection'
  | FwdEditModeName
  | `${FwdEditModeName}start`
  | `${FwdEditModeName}end`
  | GmControlLoadEvent['action'];

export type GmEvent =
  | SystemFwdEvent
  | GlobalModeToggledFwdEvent
  | FeatureFwdEvent
  | FeatureEditFwdEvent;

export type * from '@/types/events/forwarder/edit.ts';
export type * from '@/types/events/forwarder/features.ts';
export type * from '@/types/events/forwarder/mode.ts';
export type * from '@/types/events/forwarder/system.ts';
