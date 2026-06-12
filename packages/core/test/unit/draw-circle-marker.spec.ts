import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/images/controls/circle-marker.svg', () => ({ default: '<svg></svg>' }));

import { DrawCircleMarker } from '@/modes/draw/circle-marker.ts';

const createFeatureDataStub = () => ({
  temporary: true,
  getGeoJson: vi.fn(() => ({
    type: 'Feature',
    properties: {},
    geometry: { type: 'Point', coordinates: [0, 0] },
  })),
  setShapeProperty: vi.fn(() => Promise.resolve()),
  updateGeometry: vi.fn(() => Promise.resolve()),
});

const createGmMock = (featureDataStub: ReturnType<typeof createFeatureDataStub>) => ({
  options: {
    settings: {
      throttlingDelay: 10,
    },
  },
  events: {
    fire: vi.fn(() => Promise.resolve()),
    bus: {
      attachEvents: vi.fn(),
      detachEvents: vi.fn(),
    },
  },
  markerPointer: {
    marker: null,
    enable: vi.fn(),
    disable: vi.fn(),
  },
  mapAdapter: {
    project: vi.fn((lngLat: [number, number]) => lngLat),
    unproject: vi.fn((point: [number, number]) => point),
  },
  features: {
    clearSelection: vi.fn(),
    createFeature: vi.fn(() => Promise.resolve(featureDataStub)),
    delete: vi.fn(() => Promise.resolve()),
  },
});

describe('modes/draw circle_marker', () => {
  it('stores the clicked position as the center shape property', async () => {
    const featureDataStub = createFeatureDataStub();
    const gm = createGmMock(featureDataStub);
    const instance = new DrawCircleMarker(gm as never);

    const event = { lngLat: { toArray: () => [10, 20] } };
    await instance.onMouseClick(event as never);

    const firstCreateCall = gm.features.createFeature.mock.calls[0][0] as never as {
      shapeGeoJson: { properties: Record<string, unknown> };
    };
    expect(firstCreateCall.shapeGeoJson.properties.__gm_center).toEqual([10, 20]);
    expect(featureDataStub.setShapeProperty).toHaveBeenCalledWith('center', [10, 20]);
  });

  it('does not reuse the previous click position for the next feature', async () => {
    const featureDataStub = createFeatureDataStub();
    const gm = createGmMock(featureDataStub);
    const instance = new DrawCircleMarker(gm as never);

    await instance.onMouseClick({ lngLat: { toArray: () => [10, 20] } } as never);
    await instance.onMouseClick({ lngLat: { toArray: () => [30, 40] } } as never);

    // calls 0 and 2 are the temporary-source creations for click 1 and click 2
    const secondClickCreate = gm.features.createFeature.mock.calls[2][0] as never as {
      shapeGeoJson: { properties: Record<string, unknown> };
    };
    expect(secondClickCreate.shapeGeoJson.properties.__gm_center).toEqual([30, 40]);
  });
});
