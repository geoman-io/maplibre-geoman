import { FeatureData } from '@/core/features/feature-data.ts';
import { SOURCES } from '@/core/features/index.ts';
import type {
  AnyEvent,
  EditModeName,
  FeatureShape,
  GeoJsonShapeFeature,
  GMEditEvent,
  GMEditMarkerMoveEvent,
  LngLat,
  MapHandlerReturnData,
  ShapeName,
} from '@/main.ts';
import { BaseDrag } from '@/modes/edit/base-drag.ts';
import { geoJsonPointToLngLat } from '@/utils/geojson.ts';
import { isGmEditEvent } from '@/utils/guards/modes.ts';
import bearing from '@turf/bearing';
import centroid from '@turf/centroid';
import transformRotate from '@turf/transform-rotate';
import { cloneDeep } from 'lodash-es';
import log from 'loglevel';


export class EditRotate extends BaseDrag {
  mode: EditModeName = 'rotate';
  allowedShapes: Array<ShapeName> = ['line', 'rectangle', 'polygon'];
  convertFeaturesTypes: Array<FeatureShape> = ['rectangle'];

  onStartAction(): void {
    // ...
  }

  onEndAction(): void {
    // ...
  }

  handleGmEdit(event: AnyEvent): MapHandlerReturnData {
    if (!isGmEditEvent(event)) {
      log.error('EditChange.handleGmEdit: not an edit event', event);
      return { next: false };
    }

    if (this.isFeatureAllowed(event)) {
      return { next: true };
    }

    if (event.action === 'marker_move' && event.lngLatStart && event.lngLatEnd) {
      if (event.markerData?.type === 'vertex') {
        this.moveVertex(event);
      } else {
        this.moveSource(event.featureData, event.lngLatStart, event.lngLatEnd);
      }
      return { next: false };
    } else if (event.action === 'marker_captured') {
      event.featureData.changeSource({ sourceName: SOURCES.temporary, atomic: true });
      this.fireFeatureEditStartEvent({ feature: event.featureData });
    } else if (event.action === 'marker_released') {
      event.featureData.changeSource({ sourceName: SOURCES.main, atomic: true });
      this.fireFeatureEditEndEvent({ feature: event.featureData });
    }
    return { next: true };
  }

  isFeatureAllowed(event: GMEditEvent): boolean {
    return 'featureData' in event
      && !this.allowedShapes.includes(event.featureData.shape as ShapeName);
  }

  moveVertex(event: GMEditMarkerMoveEvent) {
    this.rotateFeature(event.featureData, event);
  }

  rotateFeature(featureData: FeatureData, event: GMEditMarkerMoveEvent) {
    const geoJson = cloneDeep(featureData.getGeoJson() as GeoJsonShapeFeature);
    const shapeCentroid = geoJsonPointToLngLat(centroid(geoJson));

    const angle = this.calculateRotationAngle(
      shapeCentroid,
      event.lngLatStart,
      event.lngLatEnd,
    );

    geoJson.geometry = transformRotate(geoJson, angle, { pivot: shapeCentroid }).geometry;
    this.fireBeforeFeatureUpdate({
      features: [featureData],
      geoJsonFeatures: [geoJson],
    });

    const isUpdated = this.updateFeatureGeoJson({ featureData, featureGeoJson: geoJson });

    if (isUpdated) {
      featureData.convertToPolygon(); // if possible
    }
  }

  calculateRotationAngle(pivot: LngLat, start: LngLat, end: LngLat) {
    const bearingStart = bearing(pivot, start);
    const bearingEnd = bearing(pivot, end);

    const rotationAngle = bearingEnd - bearingStart;
    return (rotationAngle + 360) % 360;
  }
}
