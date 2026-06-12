import { describe, expect, it, vi } from 'vitest';

// the Features import chain value-imports Geoman and BaseMapAdapter, which pull
// in the Svelte controls; mock them to keep this spec node-only
vi.mock('@/main.ts', () => ({
  Geoman: class {},
}));
vi.mock('@/core/map/base/index.ts', () => ({
  BaseMapAdapter: class {},
}));

vi.mock('@tests/types.ts', () => ({
  isLineBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['LineString', 'MultiLineString'].includes(geoJson?.geometry?.type ?? ''),
  isPointBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['Point', 'MultiPoint'].includes(geoJson?.geometry?.type ?? ''),
}));

import { Features } from '@/core/features/index.ts';
import type { FeatureData } from '@/core/features/feature-data.ts';
import type { FeatureId } from '@/types/features.ts';

const createFeatures = () => {
  const features = Object.create(Features.prototype) as Features;
  features.featureStore = new Map();
  features.selection = new Set<FeatureId>();
  return features;
};

const createFeatureDataStub = (id: FeatureId, source: unknown = null) =>
  ({
    id,
    source,
    shape: 'polygon',
    delete: vi.fn(() => Promise.resolve()),
  }) as unknown as FeatureData;

describe('core/features selection lifecycle', () => {
  it('removes a deleted feature from the selection', async () => {
    const features = createFeatures();
    const featureData = createFeatureDataStub('feature-1');
    features.featureStore.set('feature-1', featureData);
    features.selection.add('feature-1');

    await features.delete('feature-1');

    expect(features.featureStore.has('feature-1')).toBe(false);
    expect(features.selection.has('feature-1')).toBe(false);
  });

  it('clears the selection on deleteAll', async () => {
    const features = createFeatures();
    features.featureStore.set('feature-1', createFeatureDataStub('feature-1'));
    features.featureStore.set('feature-2', createFeatureDataStub('feature-2'));
    features.selection.add('feature-1');
    features.selection.add('feature-2');

    await features.deleteAll();

    expect(features.featureStore.size).toBe(0);
    expect(features.selection.size).toBe(0);
  });
});

describe('core/features exportGeoJson', () => {
  const createExportSetup = () => {
    const liveFeature = {
      type: 'Feature' as const,
      id: 'feature-1',
      properties: { __gm_id: 'feature-1', __gm_shape: 'polygon', custom: 'value' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 0],
          ],
        ],
      },
    };

    const source = {
      getGmGeoJson: () => ({ type: 'FeatureCollection' as const, features: [liveFeature] }),
    };

    const features = createFeatures();
    features.sources = { gm_main: source } as never;
    features.featureStore.set('feature-1', createFeatureDataStub('feature-1', source));

    return { features, liveFeature };
  };

  it('does not mutate internal feature state when exporting with a custom id property', () => {
    const { features, liveFeature } = createExportSetup();

    const exported = features.exportGeoJson({ idPropertyName: 'myId' });

    expect(exported.features).toHaveLength(1);
    expect(exported.features[0].properties).toMatchObject({ myId: 'feature-1' });
    // the internal feature must keep its __gm_id property
    expect(liveFeature.properties.__gm_id).toBe('feature-1');
  });

  it('returns identical results when exporting twice with a custom id property', () => {
    const { features } = createExportSetup();

    const first = features.exportGeoJson({ idPropertyName: 'myId' });
    const second = features.exportGeoJson({ idPropertyName: 'myId' });

    expect(second.features[0].id).toBe('feature-1');
    expect(second.features[0].properties).toEqual(first.features[0].properties);
  });

  it('returns a snapshot that is detached from internal state', () => {
    const { features, liveFeature } = createExportSetup();

    const exported = features.exportGeoJson();
    exported.features[0].properties.custom = 'mutated';
    (exported.features[0].geometry as { coordinates: unknown[] }).coordinates.pop();

    expect(liveFeature.properties.custom).toBe('value');
    expect(liveFeature.geometry.coordinates).toHaveLength(1);
  });
});
