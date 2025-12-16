import {
  type EditModeName,
  type FeatureShape,
  type GeoJsonShapeFeature,
  type GmEditEvent,
  type GmEditMarkerMoveEvent,
  type GmSystemEvent,
  type LngLatTuple,
  type MapHandlerReturnData,
  type ShapeName,
  SOURCES,
} from '@/main.ts';
import { BaseDrag } from '@/modes/edit/base-drag.ts';
import { geoJsonPointToLngLat, getGeoJsonEllipse, getLngLatDiff } from '@/utils/geojson.ts';
import { isGmEditEvent } from '@/utils/guards/modes.ts';
import bearing from '@turf/bearing';
import centroid from '@turf/centroid';
import transformRotate from '@turf/transform-rotate';
import { cloneDeep } from 'lodash-es';
import log from 'loglevel';

type RotateShapeHandler = (event: GmEditMarkerMoveEvent) => GeoJsonShapeFeature | null;

export class EditRotate extends BaseDrag {
  mode: EditModeName = 'rotate';
  allowedShapes: Array<ShapeName> = ['line', 'rectangle', 'polygon', 'ellipse'];
  convertFeaturesTypes: Array<FeatureShape> = ['rectangle'];

  shapeRotateHandlers: { [key in FeatureShape]?: RotateShapeHandler } = {
    marker: this.rotateFeature.bind(this),
    circle: this.rotateFeature.bind(this),
    circle_marker: this.rotateFeature.bind(this),
    text_marker: this.rotateFeature.bind(this),
    line: this.rotateFeature.bind(this),
    rectangle: this.rotateFeature.bind(this),
    polygon: this.rotateFeature.bind(this),
    ellipse: this.rotateEllipse.bind(this),
  };

  onStartAction(): void {
    // ...
  }

  onEndAction(): void {
    // ...
  }

  handleGmEdit(event: GmSystemEvent): MapHandlerReturnData {
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
        const lngLatDiff = getLngLatDiff(event.lngLatStart, event.lngLatEnd);
        this.moveSource(event.featureData, lngLatDiff);
      }
      return { next: false };
    } else if (event.action === 'marker_captured') {
      event.featureData.changeSource({ sourceName: SOURCES.temporary, atomic: true });
      this.setCursorToPointer();
      this.flags.actionInProgress = true;
      this.fireFeatureEditStartEvent({ feature: event.featureData });
    } else if (event.action === 'marker_released') {
      event.featureData.changeSource({ sourceName: SOURCES.main, atomic: true });
      this.fireFeatureEditEndEvent({ feature: event.featureData });
      this.flags.actionInProgress = false;
    }
    return { next: true };
  }

  isFeatureAllowed(event: GmEditEvent): boolean {
    return (
      'featureData' in event && !this.allowedShapes.includes(event.featureData.shape as ShapeName)
    );
  }

  moveVertex(event: GmEditMarkerMoveEvent) {
    const featureData = event.featureData;
    const updatedGeoJson = this.shapeRotateHandlers[featureData.shape]?.(event) || null;

    if (updatedGeoJson) {
      this.fireBeforeFeatureUpdate({
        features: [featureData],
        geoJsonFeatures: [updatedGeoJson],
      });

      const isUpdated = this.updateFeatureGeoJson({ featureData, featureGeoJson: updatedGeoJson });

      if (isUpdated && this.convertFeaturesTypes.includes(featureData.shape)) {
        featureData.convertToPolygon(); // if possible
      }
    } else {
      log.error('EditRotate.moveVertex: invalid geojson', updatedGeoJson, event);
    }
  }

  rotateEllipse(event: GmEditMarkerMoveEvent) {
    const { featureData } = event;

    if (featureData.shape !== 'ellipse') {
      log.error('EditRotate.rotateEllipse: invalid shape type', featureData);
      return null;
    }

    const center = featureData.getShapeProperty('center');
    const xSemiAxis = featureData.getShapeProperty('xSemiAxis');
    const ySemiAxis = featureData.getShapeProperty('ySemiAxis');
    const angle = featureData.getShapeProperty('angle');

    if (
      !Array.isArray(center) ||
      typeof xSemiAxis !== 'number' ||
      typeof ySemiAxis !== 'number' ||
      typeof angle !== 'number'
    ) {
      log.error(
        'rotateEllipse: missing center, xSemiAxis, ySemiAxis or angle in the featureData',
        featureData,
      );
      return null;
    }

    const deltaAngle = this.calculateRotationAngle(
      center,
      event.lngLatStart,
      event.lngLatEnd,
      false,
    );

    return getGeoJsonEllipse({
      center,
      xSemiAxis,
      ySemiAxis,
      angle: angle + deltaAngle,
    });
  }

  rotateFeature(event: GmEditMarkerMoveEvent) {
    const featureData = event.featureData;

    const geoJson = cloneDeep(featureData.getGeoJson() as GeoJsonShapeFeature);
    const shapeCentroid = geoJsonPointToLngLat(centroid(geoJson));

    const angle = this.calculateRotationAngle(shapeCentroid, event.lngLatStart, event.lngLatEnd);

    geoJson.geometry = transformRotate(geoJson, angle, { pivot: shapeCentroid }).geometry;

    return geoJson;
  }

  calculateRotationAngle(
    pivot: LngLatTuple,
    start: LngLatTuple,
    end: LngLatTuple,
    normalize = true,
  ) {
    const bearingStart = bearing(pivot, start);
    const bearingEnd = bearing(pivot, end);

    const rotationAngle = bearingEnd - bearingStart;
    return normalize ? (rotationAngle + 360) % 360 : rotationAngle;
  }
}
