import { describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('@/core/events/forwarder.ts', () => ({
  EventForwarder: class {
    processEvent = vi.fn(() => Promise.resolve());
  },
}));

import { EventBus } from '@/core/events/bus.ts';
import type { GmEventName, GmSystemEvent } from '@/types/events/index.ts';

const createPayload = () =>
  ({
    level: 'system',
    name: 'draw',
    actionType: 'draw',
    action: 'start',
  }) as unknown as GmSystemEvent;

describe('core/events/bus', () => {
  it('keeps forwarding events after a forwarded handler rejects', async () => {
    const bus = new EventBus({} as never);
    const eventName = '_gm:draw' as GmEventName;
    const processEvent = bus.forwarder.processEvent as Mock;
    processEvent.mockRejectedValueOnce(new Error('user listener boom'));

    bus.on(eventName, async () => ({ next: true }));

    await bus.fireEvent(eventName, createPayload());
    await bus.fireEvent(eventName, createPayload());

    await vi.waitFor(() => {
      expect(processEvent).toHaveBeenCalledTimes(2);
    });
  });
});
