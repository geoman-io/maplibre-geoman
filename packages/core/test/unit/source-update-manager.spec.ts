import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Feature } from 'geojson';
import log from 'loglevel';
import { SOURCES } from '@/core/features/constants.ts';

vi.mock('@/main.ts', () => ({
  FEATURE_ID_PROPERTY: '__gm_id',
}));

import { SourceUpdateManager } from '@/core/features/source-update-manager.ts';

type TestSource = {
  loaded: boolean;
  updateData: ReturnType<typeof vi.fn>;
  setData: ReturnType<typeof vi.fn>;
};

const createFeature = (id: string | number): Feature => ({
  type: 'Feature',
  properties: { __gm_id: id },
  geometry: {
    type: 'Point',
    coordinates: [0, 0],
  },
});

const createManager = (throttlingDelay: number = 5) => {
  const sources = Object.fromEntries(
    Object.values(SOURCES).map((name) => [
      name,
      {
        loaded: true,
        updateData: vi.fn(() => Promise.resolve()),
        setData: vi.fn(() => Promise.resolve()),
      },
    ]),
  ) as Record<string, TestSource>;

  const gm = {
    options: {
      settings: {
        throttlingDelay,
      },
    },
    features: {
      sources,
    },
  };

  return {
    manager: new SourceUpdateManager(gm as never),
    sources,
  };
};

describe('core/features/source-update-manager', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('reads feature ids from prefixed property then fallback id', () => {
    const { manager } = createManager();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(manager.getFeatureId(createFeature('a1'))).toBe('a1');
    expect(
      manager.getFeatureId({
        type: 'Feature',
        id: 42,
        properties: {},
        geometry: { type: 'Point', coordinates: [0, 0] },
      }),
    ).toBe(42);
    expect(
      manager.getFeatureId({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [0, 0] },
      }),
    ).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledOnce();
  });

  it('merges source diffs and resolves remove/add/update conflicts', () => {
    const { manager } = createManager();
    const prev = {
      remove: new Set([3]),
      add: new Map([[1, createFeature(1)]]),
      update: new Map([
        [
          2,
          {
            id: 2,
            addOrUpdateProperties: [{ key: 'a', value: 1 }],
            newGeometry: { type: 'Point', coordinates: [0, 0] } as GeoJSON.Geometry,
          },
        ],
      ]),
    };
    const next = {
      remove: new Set([1]),
      add: new Map([[3, createFeature(3)]]),
      update: new Map([
        [
          2,
          {
            id: 2,
            removeAllProperties: true,
            addOrUpdateProperties: [{ key: 'b', value: 2 }],
            newGeometry: { type: 'Point', coordinates: [1, 1] } as GeoJSON.Geometry,
          },
        ],
      ]),
    };

    manager.mergeGeoJsonDiff(prev, next);

    expect(Array.from(prev.remove ?? [])).toEqual([1]);
    expect(Array.from(prev.add?.keys() ?? [])).toEqual([3]);
    expect(prev.update?.get(2)).toEqual({
      id: 2,
      removeAllProperties: true,
      addOrUpdateProperties: [{ key: 'b', value: 2 }],
      newGeometry: { type: 'Point', coordinates: [1, 1] },
    });
  });

  it('clears prior add/update/remove when next diff sets removeAll', () => {
    const { manager } = createManager();
    const prev = {
      remove: new Set([1]),
      add: new Map([[2, createFeature(2)]]),
      update: new Map([[3, { id: 3 }]]),
    };
    const next = {
      removeAll: true,
      remove: new Set([2]),
    };

    manager.mergeGeoJsonDiff(prev, next);

    expect(prev.removeAll).toBe(true);
    expect(prev.remove?.size).toBe(0);
    expect(prev.add?.size).toBe(0);
    expect(prev.update?.size).toBe(0);
  });

  it('blocks update map entries in transactional-set mode', async () => {
    const { manager } = createManager();
    const sourceName = Object.values(SOURCES)[0];
    const errorSpy = vi.spyOn(log, 'error').mockImplementation(() => undefined);

    manager.beginTransaction('transactional-set', sourceName);
    await manager.updateSource({
      sourceName,
      diff: {
        add: new Map([[10, createFeature(10)]]),
        update: new Map([[10, { id: 10 }]]),
      },
    });

    expect(errorSpy).toHaveBeenCalledWith('In transactional-set updates are not allowed');
    expect(manager.updateStorage[sourceName].diff?.update).toBeUndefined();
    expect(manager.updateStorage[sourceName].diff?.add?.has(10)).toBe(true);
  });

  it('commits transactional set/update methods and resets source state', () => {
    const { manager, sources } = createManager();
    const sourceName = Object.values(SOURCES)[0];

    manager.updateStorage[sourceName].method = 'transactional-set';
    manager.updateStorage[sourceName].diff = {
      add: new Map([
        [1, createFeature(1)],
        [2, createFeature(2)],
      ]),
    };
    manager.commitTransaction(sourceName);

    expect(sources[sourceName].setData).toHaveBeenCalledWith({
      type: 'FeatureCollection',
      features: [createFeature(1), createFeature(2)],
    });
    expect(manager.updateStorage[sourceName].diff).toBeNull();
    expect(manager.updateStorage[sourceName].method).toBe('automatic');

    manager.updateStorage[sourceName].method = 'transactional-update';
    manager.updateStorage[sourceName].diff = {
      update: new Map([[1, { id: 1 }]]),
    };
    manager.commitTransaction(sourceName);

    expect(sources[sourceName].updateData).toHaveBeenCalledWith({
      update: new Map([[1, { id: 1 }]]),
    });
    expect(manager.updateStorage[sourceName].diff).toBeNull();
    expect(manager.updateStorage[sourceName].method).toBe('automatic');
  });

  it('retries updateSourceActual until source is loaded', async () => {
    vi.useFakeTimers();
    const { manager, sources } = createManager(5);
    const sourceName = Object.values(SOURCES)[0];

    manager.updateStorage[sourceName].diff = {
      add: new Map([[1, createFeature(1)]]),
    };
    sources[sourceName].loaded = false;

    manager.updateSourceActual(sourceName);
    expect(sources[sourceName].updateData).not.toHaveBeenCalled();

    sources[sourceName].loaded = true;
    await vi.advanceTimersByTimeAsync(5);

    expect(sources[sourceName].updateData).toHaveBeenCalledOnce();
    expect(manager.updateStorage[sourceName].diff).toBeNull();
  });
});
