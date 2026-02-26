import { describe, expect, it, vi } from 'vitest';

const { getDefaultOptionsMock, trackDefaultUiEnabledStateMock } = vi.hoisted(() => {
  const defaultOptions = {
    settings: {
      controlsUiEnabledByDefault: true,
      throttlingDelay: 5,
    },
    layerStyles: {
      line: [{ type: 'line', paint: { 'line-width': 1 } }],
    },
    controls: {
      draw: {
        marker: { title: 'Marker', icon: null, uiEnabled: true, active: false },
        line: { title: 'Line', icon: null, uiEnabled: true, active: false },
      },
      edit: {
        drag: { title: 'Drag', icon: null, uiEnabled: true, active: false },
      },
      helper: {
        snapping: { title: 'Snapping', icon: null, uiEnabled: true, active: false },
      },
    },
  };

  return {
    getDefaultOptionsMock: vi.fn(() => structuredClone(defaultOptions)),
    trackDefaultUiEnabledStateMock: vi.fn(),
  };
});

vi.mock('@/core/options/defaults/index.ts', () => ({
  getDefaultOptions: getDefaultOptionsMock,
  trackDefaultUiEnabledState: trackDefaultUiEnabledStateMock,
}));

vi.mock('@/main.ts', () => ({
  DRAW_MODES: ['marker', 'line'],
  isGmModeEvent: (payload: { action?: string }) =>
    ['mode_start', 'mode_started', 'mode_end', 'mode_ended'].includes(payload.action ?? ''),
}));

vi.mock('@/utils/guards/modes.ts', () => ({
  isGmDrawEvent: (payload: { actionType?: string }) => payload.actionType === 'draw',
  isGmEditEvent: (payload: { actionType?: string }) => payload.actionType === 'edit',
  isGmHelperEvent: (payload: { actionType?: string }) => payload.actionType === 'helper',
}));

vi.mock('@/utils/guards/map.ts', () => ({
  isPartialLayer: (object: unknown) =>
    !!object &&
    typeof object === 'object' &&
    'type' in object &&
    ['symbol', 'fill', 'line', 'circle'].includes((object as { type: string }).type),
}));

import { GmOptions } from '@/core/options/index.ts';

const createGm = () => ({
  actionInstances: {},
  drawClassMap: {
    marker: class MockMarkerDraw {},
  },
  editClassMap: {
    drag: class MockDragEdit {},
  },
  helperClassMap: {
    snapping: class MockSnappingHelper {},
  },
  events: {
    fire: vi.fn(async () => undefined),
  },
});

describe('core/options/GmOptions', () => {
  it('merges input options with defaults and composes layer styles by type', () => {
    const gm = createGm();
    const options = new GmOptions(gm as never, {
      settings: { controlsUiEnabledByDefault: false },
      layerStyles: {
        line: [
          { type: 'line', paint: { 'line-color': '#f00' } },
          { type: 'circle', paint: { 'circle-radius': 4 } },
        ],
      },
    } as never);

    expect(getDefaultOptionsMock).toHaveBeenCalledOnce();
    expect(trackDefaultUiEnabledStateMock).toHaveBeenCalledOnce();
    expect(options.settings.controlsUiEnabledByDefault).toBe(false);
    expect(options.layerStyles.line).toEqual([
      { type: 'line', paint: { 'line-width': 1, 'line-color': '#f00' } },
      { type: 'circle', paint: { 'circle-radius': 4 } },
    ]);
  });

  it('checks mode availability from class maps', () => {
    const gm = createGm();
    const options = new GmOptions(gm as never, {});

    expect(options.isModeAvailable('draw', 'marker' as never)).toBe(true);
    expect(options.isModeAvailable('draw', 'line' as never)).toBe(false);
    expect(options.isModeAvailable('edit', 'drag' as never)).toBe(true);
    expect(options.isModeAvailable('helper', 'snapping' as never)).toBe(true);
  });

  it('enables and disables modes with expected event ordering', async () => {
    const gm = createGm();
    const options = new GmOptions(gm as never, {});

    await options.enableMode('draw', 'marker' as never);
    expect(options.controls.draw.marker.active).toBe(true);
    expect(gm.events.fire).toHaveBeenNthCalledWith(
      1,
      '_gm:draw',
      expect.objectContaining({ action: 'mode_start', actionType: 'draw' }),
    );
    expect(gm.events.fire).toHaveBeenNthCalledWith(
      2,
      '_gm:control',
      expect.objectContaining({ action: 'on', actionType: 'control' }),
    );
    expect(gm.events.fire).toHaveBeenNthCalledWith(
      3,
      '_gm:draw',
      expect.objectContaining({ action: 'mode_started', actionType: 'draw' }),
    );

    gm.actionInstances['draw__marker'] = {};
    await options.disableMode('draw', 'marker' as never);
    expect(options.controls.draw.marker.active).toBe(false);
    expect(gm.events.fire).toHaveBeenNthCalledWith(
      4,
      '_gm:draw',
      expect.objectContaining({ action: 'mode_end', actionType: 'draw' }),
    );
    expect(gm.events.fire).toHaveBeenNthCalledWith(
      5,
      '_gm:control',
      expect.objectContaining({ action: 'off', actionType: 'control' }),
    );
    expect(gm.events.fire).toHaveBeenNthCalledWith(
      6,
      '_gm:draw',
      expect.objectContaining({ action: 'mode_ended', actionType: 'draw' }),
    );
  });

  it('syncs unavailable modes to inactive and ui-disabled state', async () => {
    const gm = createGm();
    const options = new GmOptions(gm as never, {});

    options.controls.draw.line.active = true;
    options.controls.draw.line.uiEnabled = true;

    await options.syncModeState('draw', 'line' as never);

    expect(options.controls.draw.line.active).toBe(false);
    expect(options.controls.draw.line.uiEnabled).toBe(false);
  });
});
