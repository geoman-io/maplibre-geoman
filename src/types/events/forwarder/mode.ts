import type { GmDrawModeEvent } from '@/types/events/draw.ts';
import type { GmEditModeEvent } from '@/types/events/edit.ts';
import type { GmHelperModeEvent } from '@/types/events/helper.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';

import type { DrawModeName, HelperModeName } from '@/types/modes/index.ts';
import type { BaseFwdEvent } from '@/types/events/forwarder/base.ts';
import type { FwdEditModeName, GmPrefix } from '@/types';

export interface GlobalDrawToggledFwdEvent extends BaseFwdEvent<GmDrawModeEvent> {
  type: `${GmPrefix}:globaldrawmodetoggled`;
  enabled: boolean;
  shape: DrawModeName;
  map: AnyMapInstance;
}

export interface GlobalDrawEnabledDisabledFwdEvent extends BaseFwdEvent<GmDrawModeEvent> {
  type: `${GmPrefix}:${'drawstart' | 'drawend'}`;
  shape: DrawModeName;
  map: AnyMapInstance;
}

export interface GlobalEditToggledFwdEvent extends BaseFwdEvent<GmEditModeEvent> {
  type: `${GmPrefix}:global${FwdEditModeName}modetoggled`;
  enabled: boolean;
  map: AnyMapInstance;
}

export interface GlobalHelperToggledFwdEvent extends BaseFwdEvent<GmHelperModeEvent> {
  type: `${GmPrefix}:global${HelperModeName}modetoggled`;
  enabled: boolean;
  map: AnyMapInstance;
}

export type GlobalModeToggledFwdEvent =
  | GlobalDrawToggledFwdEvent
  | GlobalEditToggledFwdEvent
  | GlobalHelperToggledFwdEvent
  | GlobalDrawEnabledDisabledFwdEvent;
