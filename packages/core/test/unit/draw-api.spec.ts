import { describe, expect, it, vi } from 'vitest';
vi.mock('@/core/map/base/index.ts', () => ({ BaseMapAdapter: class {} }));
vi.mock('@tests/types.ts', () => ({
  isLineBasedGeoJsonFeature: () => false,
  isPointBasedGeoJsonFeature: () => false,
}));
vi.mock('@/core/features/feature-data.ts', () => ({ FeatureData: class {} }));
import { GmDrawApi } from '@/core/draw-api.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { buildDrawFeature } from '@/utils/draw-input.ts';
import type { Geoman } from '@/main.ts';
import type { DrawInput } from '@/types/draw-api.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { DrawModeName } from '@/types/modes/index.ts';
import { FEATURE_ID_PROPERTY } from '@/core/features/constants.ts';

const input: DrawInput = { shape: 'circle', center: [0, 50], radiusMeters: 100 };
class Draft extends BaseDraw {
  mode: DrawModeName = 'circle';
  shape = 'circle' as const;
  eventHandlers = {};
  candidate: GeoJsonShapeFeature | null = buildDrawFeature(input);
  onStartAction() {}
  onEndAction() {}
  getFinishGeoJson() {
    return this.candidate;
  }
}
const harness = () => {
  const attached: Array<Record<string, (payload: never) => unknown>> = [];
  const created = { id: 'created', getGeoJson: () => ({}) };
  const gm = {
    loaded: true,
    destroyed: false,
    actionInstances: {} as Record<string, Draft>,
    options: { settings: { validateSchema: false } },
    dataLayers: { acceptsGeometry: () => true },
    getActiveDrawModes: () => Object.values(gm.actionInstances).map((x) => x.mode),
    events: {
      fire: vi.fn(async (_name: string, _event: unknown) => {}),
      bus: {
        attachEvents: vi.fn((handlers) => {
          attached.push(handlers);
        }),
        detachEvents: vi.fn((handlers) => {
          attached.splice(attached.indexOf(handlers), 1);
        }),
      },
    },
    features: {
      defaultSourceName: 'gm_main',
      createFeature: vi.fn(async (_args: unknown) => created),
    },
    disableMode: vi.fn(async (_type: string, mode: string) => {
      delete gm.actionInstances[`draw__${mode}`];
    }),
  };
  const api = new GmDrawApi(gm as unknown as Geoman);
  const draft = () => {
    const value = new Draft(gm as unknown as Geoman);
    gm.actionInstances.draw__circle = value;
    return value;
  };
  return { gm, api, draft, attached, created };
};

describe('draw API lifecycle', () => {
  it.each([
    input,
    { shape: 'marker', coordinates: [0, 0] },
    { shape: 'rectangle', center: [0, 0], widthMeters: 10, heightMeters: 10 },
  ] as DrawInput[])('creates a complete $shape without enabling a mode', async (value) => {
    const { gm, api, created, attached } = harness();
    expect(await api.create(value)).toEqual({ ok: true, feature: created });
    expect(gm.features.createFeature).toHaveBeenCalledOnce();
    expect(gm.disableMode).not.toHaveBeenCalled();
    expect(gm.getActiveDrawModes()).toEqual([]);
    expect(attached).toHaveLength(0);
  });
  it('finishes a valid preview with a fresh persistent identity', async () => {
    const { gm, api, draft } = harness();
    const active = draft();
    active.candidate!.id = 'temporary';
    active.candidate!.properties[FEATURE_ID_PROPERTY] = 'temporary';
    expect((await api.finish()).ok).toBe(true);
    const args = gm.features.createFeature.mock.calls[0][0] as {
      shapeGeoJson: GeoJsonShapeFeature;
    };
    expect(args.shapeGeoJson.id).toBeUndefined();
    expect(args.shapeGeoJson.properties[FEATURE_ID_PROPERTY]).toBeUndefined();
    expect(active.candidate!.id).toBe('temporary');
    expect(gm.disableMode).toHaveBeenCalledExactlyOnceWith('draw', 'circle');
    expect(await api.finish()).toEqual({ ok: false, reason: 'no_active_draw' });
    expect(gm.features.createFeature).toHaveBeenCalledOnce();
  });
  it('uses full form values even when the current preview is incomplete', async () => {
    const { api, draft } = harness();
    draft().candidate = null;
    expect((await api.finish(input)).ok).toBe(true);
  });
  it.each(['not_loaded', 'destroyed'] as const)('rejects %s', async (reason) => {
    const { api, gm } = harness();
    if (reason === 'destroyed') gm.destroyed = true;
    else gm.loaded = false;
    expect(await api.create(input)).toEqual({ ok: false, reason });
    expect(gm.features.createFeature).not.toHaveBeenCalled();
  });
  it('rejects create with an active draw and finish with no draw', async () => {
    const { api, draft } = harness();
    expect(await api.finish(input)).toEqual({ ok: false, reason: 'no_active_draw' });
    draft();
    expect(await api.create(input)).toEqual({ ok: false, reason: 'active_draw' });
  });
  it('leaves invalid and mismatched drafts untouched', async () => {
    const { gm, api, draft } = harness();
    const active = draft();
    active.candidate = null;
    expect(await api.finish()).toEqual({ ok: false, reason: 'incomplete_draft' });
    expect(await api.finish({ ...input, radiusMeters: 0 })).toEqual({
      ok: false,
      reason: 'invalid_input',
    });
    expect(await api.finish({ shape: 'marker', coordinates: [0, 0] })).toEqual({
      ok: false,
      reason: 'shape_mismatch',
    });
    expect(gm.actionInstances.draw__circle).toBe(active);
    expect(gm.disableMode).not.toHaveBeenCalled();
    expect(gm.features.createFeature).not.toHaveBeenCalled();
  });
  it('rejects unsupported active modes and multiple active modes', async () => {
    const { api, gm, draft } = harness();
    const active = draft();
    active.mode = 'line';
    delete gm.actionInstances.draw__circle;
    gm.actionInstances.draw__line = active;
    expect(await api.finish()).toEqual({ ok: false, reason: 'unsupported_shape' });
    gm.actionInstances.draw__rectangle = new Draft(gm as unknown as Geoman);
    expect(await api.finish()).toEqual({ ok: false, reason: 'busy' });
  });
  it('honours geofencing rejection and detaches the temporary validation context', async () => {
    const { api, gm, attached } = harness();
    gm.events.fire.mockImplementation(async () => {
      for (const handlers of attached)
        for (const handler of Object.values(handlers)) {
          handler({
            name: '_gm:helper:geofencing_violation',
            level: 'system',
            actionType: 'draw',
            action: 'geofencing_violation',
            mode: 'circle',
          } as never);
        }
    });
    expect(await api.create(input)).toEqual({ ok: false, reason: 'creation_rejected' });
    expect(gm.features.createFeature).not.toHaveBeenCalled();
    expect(attached).toHaveLength(0);
  });
  it('preserves the draft when the target source rejects creation', async () => {
    const { gm, api, draft } = harness();
    const active = draft();
    gm.features.createFeature.mockResolvedValueOnce(null as never);
    expect(await api.finish()).toEqual({ ok: false, reason: 'creation_rejected' });
    expect(gm.actionInstances.draw__circle).toBe(active);
    expect(gm.disableMode).not.toHaveBeenCalled();
  });
  it('rejects concurrent submissions and excludes pointer updates during a commit', async () => {
    const { gm, api } = harness();
    let release!: () => void;
    gm.events.fire.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    const pending = api.create(input);
    expect(await api.create(input)).toEqual({ ok: false, reason: 'busy' });
    const pointer = vi.fn(() => ({ next: true }));
    expect(await api.runInteraction(pointer)).toEqual({ next: false });
    expect(pointer).not.toHaveBeenCalled();
    release();
    expect((await pending).ok).toBe(true);
    expect(gm.features.createFeature).toHaveBeenCalledOnce();
  });
  it('rejects API commits while an earlier pointer handler is in flight', async () => {
    const { api } = harness();
    let release!: () => void;
    const pointer = api.runInteraction(
      () =>
        new Promise((resolve) => {
          release = () => resolve({ next: true });
        }),
    );
    expect(await api.create(input)).toEqual({ ok: false, reason: 'busy' });
    release();
    await pointer;
    expect((await api.create(input)).ok).toBe(true);
  });
  it('releases the lock and validation listener if a handler throws', async () => {
    const { gm, api, attached } = harness();
    gm.events.fire.mockRejectedValueOnce(new Error('listener failed'));
    await expect(api.create(input)).rejects.toThrow('listener failed');
    expect(attached).toHaveLength(0);
    expect((await api.create(input)).ok).toBe(true);
  });
  it('rechecks map destruction after asynchronous validation', async () => {
    const { gm, api } = harness();
    gm.events.fire.mockImplementationOnce(async () => {
      gm.destroyed = true;
    });
    expect(await api.create(input)).toEqual({ ok: false, reason: 'destroyed' });
    expect(gm.features.createFeature).not.toHaveBeenCalled();
  });
  it('does not commit a draft replaced by a validation listener', async () => {
    const { gm, api, draft } = harness();
    draft();
    gm.events.fire.mockImplementationOnce(async () => {
      delete gm.actionInstances.draw__circle;
    });
    expect(await api.finish()).toEqual({ ok: false, reason: 'no_active_draw' });
    expect(gm.features.createFeature).not.toHaveBeenCalled();
  });
});
