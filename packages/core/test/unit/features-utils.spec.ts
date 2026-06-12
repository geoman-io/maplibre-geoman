import { describe, expect, it, vi } from 'vitest';
import type { Polygon } from 'geojson';

// '@/utils/features.ts' value-imports BaseMapAdapter, which pulls in the Svelte
// controls; mock it to keep this spec node-only
vi.mock('@/core/map/base/index.ts', () => ({
  BaseMapAdapter: class {},
}));

vi.mock('@tests/types.ts', () => ({
  isLineBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['LineString', 'MultiLineString'].includes(geoJson?.geometry?.type ?? ''),
  isPointBasedGeoJsonFeature: (geoJson: { geometry?: { type?: string } }) =>
    ['Point', 'MultiPoint'].includes(geoJson?.geometry?.type ?? ''),
}));

import { moveFeatureData } from '@/utils/features.ts';

describe('utils/features moveFeatureData', () => {
  const createCircleFeatureStub = (center: [number, number]) => {
    const geoJson = {
      type: 'Feature' as const,
      properties: { __gm_shape: 'circle', __gm_center: center },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [center[0] + 1, center[1]],
            [center[0], center[1] + 1],
            [center[0] - 1, center[1]],
            [center[0] + 1, center[1]],
          ],
        ],
      } satisfies Polygon,
    };

    let storedCenter: unknown = center;
    return {
      geoJson,
      getCenter: () => storedCenter,
      featureData: {
        getGeoJson: () => geoJson,
        getShapeProperty: vi.fn(() => storedCenter),
        setShapeProperty: vi.fn((_name: string, value: unknown) => {
          storedCenter = value;
          return Promise.resolve();
        }),
        updateGeometry: vi.fn(() => Promise.resolve()),
      },
    };
  };

  it('keeps the center shape property a valid [lng, lat] tuple after a move', async () => {
    const stub = createCircleFeatureStub([10, 20]);

    await moveFeatureData(stub.featureData as never, { lng: 1, lat: 2 });

    expect(stub.getCenter()).toEqual([11, 22]);
  });

  it('updates the geometry with the moved coordinates without mutating the source', async () => {
    const stub = createCircleFeatureStub([10, 20]);

    await moveFeatureData(stub.featureData as never, { lng: 1, lat: 2 });

    expect(stub.featureData.updateGeometry).toHaveBeenCalledTimes(1);
    const movedGeometry = stub.featureData.updateGeometry.mock.calls[0][0] as Polygon;
    expect(movedGeometry.coordinates[0][0]).toEqual([12, 22]);
    // the stored geojson is only updated through updateGeometry
    expect(stub.geoJson.geometry.coordinates[0][0]).toEqual([11, 20]);
  });
});
