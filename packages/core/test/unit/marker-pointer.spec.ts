import { describe, expect, it, vi } from 'vitest';
import log from 'loglevel';

// '@/utils/guards/map.ts' value-imports Geoman from '@/main.ts', which pulls in
// the Svelte controls; mock it to keep this spec node-only
vi.mock('@/main.ts', () => ({
  Geoman: class {},
}));

import { MarkerPointer } from '@/utils/draw/marker-pointer.ts';

const createGmMock = () => ({
  actionInstances: {
    helper__snapping: {},
  },
  options: {
    settings: {
      throttlingDelay: 10,
    },
  },
  events: {
    bus: {
      attachEvents: vi.fn(),
      detachEvents: vi.fn(),
    },
  },
});

const getSnapping = (markerPointer: MarkerPointer) =>
  (markerPointer as unknown as { snapping: boolean }).snapping;

describe('utils/draw/marker-pointer snapping pause/resume', () => {
  it('restores the original snapping value after pause and resume', () => {
    const markerPointer = new MarkerPointer(createGmMock() as never);

    markerPointer.setSnapping(true);
    markerPointer.pauseSnapping();
    expect(getSnapping(markerPointer)).toBe(false);

    markerPointer.resumeSnapping();
    expect(getSnapping(markerPointer)).toBe(true);
  });

  it('does not clobber the saved snapping state on a double pause', () => {
    const errorSpy = vi.spyOn(log, 'error').mockImplementation(() => undefined);
    const markerPointer = new MarkerPointer(createGmMock() as never);

    markerPointer.setSnapping(true);
    markerPointer.pauseSnapping();
    markerPointer.pauseSnapping();
    expect(errorSpy).toHaveBeenCalledWith('MarkerPointer: snapping is already paused');

    markerPointer.resumeSnapping();
    expect(getSnapping(markerPointer)).toBe(true);

    errorSpy.mockRestore();
  });
});
