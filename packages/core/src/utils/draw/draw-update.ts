import { GM_PREFIX } from '@/core/constants.ts';
import type { Geoman } from '@/main.ts';
import type { DrawUpdateFwdEvent } from '@/types/events/forwarder/index.ts';
import type { LngLatTuple } from '@/types/map/index.ts';
import type { ShapeName } from '@/types/modes/index.ts';

/** Public notification that the in-progress line or polygon draft changed (#268). */
export const fireDrawUpdate = async (
  gm: Geoman,
  details: { shape: ShapeName; coordinates: Array<LngLatTuple> },
): Promise<void> => {
  const payload: DrawUpdateFwdEvent = {
    name: `${GM_PREFIX}:drawupdate`,
    actionType: 'draw',
    action: 'update',
    shape: details.shape,
    coordinates: details.coordinates.map((coordinate) => [coordinate[0], coordinate[1]]),
    map: gm.mapAdapter.getMapInstance(),
  };
  await gm.events.bus.forwarder.fireToMap({
    type: 'converted',
    eventName: 'drawupdate',
    payload,
  });
};
