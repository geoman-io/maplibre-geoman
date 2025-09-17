import type { GmDrawModeEvent } from '@/types/events/draw.ts';
import type { GmEditModeEvent } from '@/types/events/edit.ts';
import type { GmHelperModeEvent } from '@/types/events/helper.ts';
import type { AnyMapInstance } from '@/types/map/index.ts';

import type { DrawModeName } from '@/types/modes/index.ts';

interface GlobalDrawToggledFwdEvent extends Pick<GmDrawModeEvent, 'actionType' | 'action'> {
  enabled: boolean;
  shape: DrawModeName;
  map: AnyMapInstance;
}

interface GlobalDrawEnabledDisabledFwdEvent extends Pick<GmDrawModeEvent, 'actionType' | 'action'> {
  shape: DrawModeName;
  map: AnyMapInstance;
}

interface GlobalEditToggledFwdEvent extends Pick<GmEditModeEvent, 'actionType' | 'action'> {
  enabled: boolean;
  map: AnyMapInstance;
}

interface GlobalHelperToggledFwdEvent extends Pick<GmHelperModeEvent, 'actionType' | 'action'> {
  enabled: boolean;
  map: AnyMapInstance;
}

export type GlobalModeToggledFwdEvent =
  | GlobalDrawToggledFwdEvent
  | GlobalEditToggledFwdEvent
  | GlobalHelperToggledFwdEvent
  | GlobalDrawEnabledDisabledFwdEvent;
