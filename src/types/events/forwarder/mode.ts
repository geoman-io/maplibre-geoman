import type { AnyMapInstance } from '@/types/map/index.ts';

import type { DrawModeName } from '@/types/modes/index.ts';

interface GlobalDrawToggledFwdEvent {
  enabled: boolean;
  shape: DrawModeName;
  map: AnyMapInstance;
}

interface GlobalDrawEnabledDisabledFwdEvent {
  shape: DrawModeName;
  map: AnyMapInstance;
}

interface GlobalEditToggledFwdEvent {
  enabled: boolean;
  map: AnyMapInstance;
}

export type GlobalModeToggledFwdEvent =
  | GlobalDrawToggledFwdEvent
  | GlobalEditToggledFwdEvent
  | GlobalDrawEnabledDisabledFwdEvent;
