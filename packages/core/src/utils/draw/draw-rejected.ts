import { GM_PREFIX } from '@/core/constants.ts';
import type { Geoman } from '@/main.ts';
import type { DrawRejectedFwdEvent } from '@/types/events/forwarder/index.ts';
import type { DrawModeName, ShapeName } from '@/types/modes/index.ts';

export const fireDrawRejected = async (
  gm: Geoman,
  details: {
    mode: DrawModeName;
    shape: ShapeName | null;
    reason: string;
  },
): Promise<void> => {
  const payload: DrawRejectedFwdEvent = {
    name: `${GM_PREFIX}:draw:rejected`,
    actionType: 'draw',
    action: 'rejected',
    mode: details.mode,
    shape: details.shape,
    reason: details.reason,
    map: gm.mapAdapter.getMapInstance(),
  };
  await gm.events.bus.forwarder.fireToMap({
    type: 'converted',
    eventName: 'draw:rejected',
    payload,
  });
};
