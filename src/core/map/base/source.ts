import type { GeoJsonDiffStorage, GeoJsonShapeFeatureCollection } from '@/main.ts';
import type { GeoJSON } from 'geojson';
import log from 'loglevel';


export abstract class BaseSource<TSourceInstance = unknown> {
  abstract sourceInstance: TSourceInstance | null;

  abstract createSource(
    { geoJson, sourceId }: { sourceId: string, geoJson: GeoJSON },
  ): TSourceInstance;

  abstract get id(): string;

  abstract getGeoJson(): GeoJsonShapeFeatureCollection;

  abstract setGeoJson(geoJson: GeoJSON): void;

  abstract updateData(updateStorage: GeoJsonDiffStorage): void;

  abstract remove(): void;

  isInstanceAvailable(): this is { sourceInstance: TSourceInstance } {
    if (this.sourceInstance) {
      return true;
    }

    log.error('Source instance is not available');
    return false;
  }
}
