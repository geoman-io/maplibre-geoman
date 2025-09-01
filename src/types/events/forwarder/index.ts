import { gmSystemPrefix } from '@/core/events/forwarder.ts';
import type { GMControlLoadEvent } from '@/types/events/control.ts';
import type { FeatureEditFwdEvent, FwdEditModeName } from '@/types/events/forwarder/edit.ts';
import type { FeatureFwdEvent } from '@/types/events/forwarder/features.ts';
import type { GlobalModeToggledFwdEvent } from '@/types/events/forwarder/mode.ts';
import type { SystemFwdEvent } from '@/types/events/forwarder/system.ts';
import type { GMEvent, GmEventNameWithoutPrefix, GmPrefix } from '@/types/events/index.ts';
import type { HelperModeName } from '@/types/modes/index.ts';

export type GmSystemPrefix = typeof gmSystemPrefix;
export type GmFwdEventNameWithPrefix = `${GmPrefix}:${GmFwdEventName}`;
export type GmFwdSystemEventNameWithPrefix = `${GmSystemPrefix}:${GmEventNameWithoutPrefix}`;
export type GlobalEventsListenerParameters = {
  type: 'system' | 'converted';
  name: GmFwdEventNameWithPrefix | GmFwdSystemEventNameWithPrefix;
  payload: GmFwdEvent | GMEvent;
};
export type GlobalEventsListener = (parameters: GlobalEventsListenerParameters) => void;

export type GmFwdEventName =
  | 'globaldrawmodetoggled'
  | 'drawstart'
  | 'drawend'
  | `global${FwdEditModeName}modetoggled`
  | `global${HelperModeName}modetoggled`
  | 'create'
  | 'remove'
  | FwdEditModeName
  | `${FwdEditModeName}start`
  | `${FwdEditModeName}end`
  | GMControlLoadEvent['action'];

export type GmFwdEvent =
  | SystemFwdEvent
  | GlobalModeToggledFwdEvent
  | FeatureFwdEvent
  | FeatureEditFwdEvent;

export type * from '@/types/events/forwarder/edit.ts';
export type * from '@/types/events/forwarder/features.ts';
export type * from '@/types/events/forwarder/mode.ts';
export type * from '@/types/events/forwarder/system.ts';
