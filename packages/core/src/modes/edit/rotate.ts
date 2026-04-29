import { SOURCES } from '@/core/features/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import type { GmEditEvent, GmEditMarkerMoveEvent } from '@/types/events/edit.ts';
import type { GmSystemEvent } from '@/types/events/index.ts';
import type { FeatureShape } from '@/types/features.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLatTuple } from '@/types/map/index.ts';
import type { EditModeName, ShapeName } from '@/types/modes/index.ts';
import { BaseDrag } from '@/modes/edit/base-drag.ts';
import { getShapeProperties } from '@/utils/features.ts';
import {
  geoJsonPointToLngLat,
  getGeoJsonCircle,
  getGeoJsonEllipse,
  getGeoJsonFirstPoint,
  isEqualPosition,
} from '@/utils/geojson.ts';
import { isGmEditEvent } from '@/utils/guards/modes.ts';
import {
  moveRectangle as moveRectangleGeoJson,
  rotateRectangle as rotateRectangleGeoJson,
} from '@/utils/shapes.ts';
import bearing from '@turf/bearing';
import centroid from '@turf/centroid';
import { featureCollection, point } from '@turf/helpers';
import { toMercator, toWgs84 } from '@turf/projection';
import transformRotate from '@turf/transform-rotate';
import type { Feature, Polygon } from 'geojson';
import { cloneDeep } from 'lodash-es';
import log from 'loglevel';

type RotateShapeHandler = (
  featureData: FeatureData,
  shapeCentroid: LngLatTuple | undefined,
  event: GmEditMarkerMoveEvent,
) => GeoJsonShapeFeature | null;

export class EditRotate extends BaseDrag {
  mode: EditModeName = 'rotate';
  allowedShapes: Array<ShapeName> = ['line', 'rectangle', 'polygon', 'ellipse', 'circle'];
  convertFeaturesTypes: Array<FeatureShape> = [];

  shapeRotateHandlers: { [key in FeatureShape]?: RotateShapeHandler } = {
    marker: this.rotateFeature.bind(this),
    circle: this.rotateCircle.bind(this),
    circle_marker: this.rotateFeature.bind(this),
    text_marker: this.rotateFeature.bind(this),
    line: this.rotateFeature.bind(this),
    rectangle: this.rotateRectangle.bind(this),
    polygon: this.rotateFeature.bind(this),
    ellipse: this.rotateEllipse.bind(this),
  };

  onStartAction(): void {
    this.bodyDragEnabled = this.getSettingValue('bodyDragEnabled') === true;
  }

  onEndAction(): void {
    // ...
  }

  async handleGmEdit(event: GmSystemEvent) {
    if (!isGmEditEvent(event)) {
      log.error('EditChange.handleGmEdit: not an edit event', event);
      return { next: false };
    }

    if (this.isFeatureAllowed(event)) {
      return { next: true };
    }

    if (event.action === 'marker_move' && event.lngLatStart && event.lngLatEnd) {
      if (event.markerData?.type === 'vertex') {
        await this.moveVertex(event);
      } else {
        this.moveSource(event.featureData, event.lngLatStart, event.lngLatEnd);
      }
      return { next: false };
    } else if (event.action === 'marker_captured') {
      this.gm.features.updateManager.beginTransaction('transactional-update');
      for (const fd of [event.featureData, ...(event.linkedFeatures ?? [])]) {
        await fd.changeSource({ sourceName: SOURCES.temporary });
        await this.fireFeatureEditStartEvent({ feature: fd });
      }
      this.gm.features.updateManager.commitTransaction();
      this.setCursorToPointer();
      this.flags.actionInProgress = true;
    } else if (event.action === 'marker_released') {
      this.flags.actionInProgress = false;
      this.gm.features.updateManager.beginTransaction('transactional-update');
      for (const fd of [event.featureData, ...(event.linkedFeatures ?? [])]) {
        await fd.changeSource({ sourceName: SOURCES.main });
        await this.fireFeatureEditEndEvent({ feature: fd });
      }
      this.gm.features.updateManager.commitTransaction();
    }
    return { next: true };
  }

  isFeatureAllowed(event: GmEditEvent): boolean {
    return (
      'featureData' in event && !this.allowedShapes.includes(event.featureData.shape as ShapeName)
    );
  }

  async moveVertex(event: GmEditMarkerMoveEvent) {
    const groupFeatures = [event.featureData, ...(event.linkedFeatures ?? [])];
    const shapeCentroid =
      groupFeatures.length > 1
        ? geoJsonPointToLngLat(
            centroid(
              featureCollection(groupFeatures.map((featureData) => featureData.getGeoJson())),
            ),
          )
        : undefined;

    for (const featureData of groupFeatures) {
      const customRotateHandlerFunc = this.gm.options.settings.customRotateHandler;

      let updatedGeoJson: GeoJsonShapeFeature | null = null;

      if (customRotateHandlerFunc) {
        // if we iterate groupFeature.length > 1 and shapeCentroid is not undefined
        updatedGeoJson = customRotateHandlerFunc({
          featureData,
          lngLatStart: event.lngLatStart,
          lngLatEnd: event.lngLatEnd,
          shapeCentroid,
        });
      }

      if (!updatedGeoJson) {
        updatedGeoJson =
          this.shapeRotateHandlers[featureData.shape]?.(featureData, shapeCentroid, event) || null;
      }

      if (updatedGeoJson) {
        await this.fireBeforeFeatureUpdate({
          features: [featureData],
          geoJsonFeatures: [updatedGeoJson],
        });

        const isUpdated = await this.updateFeatureGeoJson({
          featureData: featureData,
          featureGeoJson: updatedGeoJson,
        });

        if (isUpdated && this.convertFeaturesTypes.includes(featureData.shape)) {
          await featureData.convertToPolygon(); // if possible
        }
      } else {
        log.error('EditRotate.moveVertex: invalid geojson', updatedGeoJson, event);
      }
    }
  }

  rotateRectangle(
    featureData: FeatureData,
    shapeCentroid: LngLatTuple | undefined,
    event: GmEditMarkerMoveEvent,
  ) {
    if (featureData.shape !== 'rectangle') {
      log.error('EditRotate.rotateRectangle: invalid shape type', featureData);
      return null;
    }

    const rectangleProperties = getShapeProperties(featureData.getGeoJson(), 'rectangle');
    if (!rectangleProperties) {
      log.warn("EditRotate.rotateRectangle: properties aren't valid", featureData);
      return this.rotateFeature(featureData, shapeCentroid, event);
    }

    const rotationPivot = shapeCentroid ?? rectangleProperties.center;

    const deltaAngle = this.calculateMercatorRotationAngle(
      rotationPivot,
      event.lngLatStart,
      event.lngLatEnd,
    );

    const rotatedCenter = isEqualPosition(rotationPivot, rectangleProperties.center)
      ? rectangleProperties.center
      : this.rotateMercatorLngLat(rectangleProperties.center, rotationPivot, deltaAngle);

    return moveRectangleGeoJson(
      rotateRectangleGeoJson(featureData.getGeoJson(), rectangleProperties.angle + deltaAngle),
      rotatedCenter,
    );
  }

  rotateCircle(
    featureData: FeatureData,
    shapeCentroid: LngLatTuple | undefined,
    event: GmEditMarkerMoveEvent,
  ) {
    if (featureData.shape !== 'circle') {
      log.error('EditRotate.rotateCircle: invalid shape type', featureData);
      return null;
    }

    const circleProperties = getShapeProperties(featureData.getGeoJson(), 'circle');
    if (!circleProperties) {
      log.error('rotateCircle: wrong properties', featureData.getGeoJson());
      return null;
    }

    const rotationPivot = shapeCentroid ?? circleProperties.center;

    if (isEqualPosition(rotationPivot, circleProperties.center)) {
      return featureData.getGeoJson();
    }

    const deltaAngle = this.calculateRotationAngle(
      rotationPivot,
      event.lngLatStart,
      event.lngLatEnd,
      false,
    );

    const geoJson = featureData.getGeoJson() as Feature<Polygon>;
    const circleRimLngLat = getGeoJsonFirstPoint(geoJson);
    if (!circleRimLngLat) {
      log.error('rotateCircle: missing center circleRimLngLat');
      return null;
    }

    const rotatedCenter = transformRotate(point(circleProperties.center), deltaAngle, {
      pivot: rotationPivot,
    }).geometry.coordinates as LngLatTuple;
    const radius = this.gm.mapAdapter.getDistance(circleProperties.center, circleRimLngLat);

    return getGeoJsonCircle({
      center: rotatedCenter,
      radius,
    }) as GeoJsonShapeFeature;
  }

  rotateEllipse(
    featureData: FeatureData,
    shapeCentroid: LngLatTuple | undefined,
    event: GmEditMarkerMoveEvent,
  ) {
    if (featureData.shape !== 'ellipse') {
      log.error('EditRotate.rotateEllipse: invalid shape type', featureData);
      return null;
    }

    const ellipseProperties = getShapeProperties(featureData.getGeoJson(), 'ellipse');
    if (!ellipseProperties) {
      log.error('rotateEllipse: wrong properties', featureData.getGeoJson());
      return null;
    }

    const rotationPivot = shapeCentroid ?? ellipseProperties.center;

    const deltaAngle = this.calculateRotationAngle(
      rotationPivot,
      event.lngLatStart,
      event.lngLatEnd,
      false,
    );

    const rotatedCenter = transformRotate(point(ellipseProperties.center), deltaAngle, {
      pivot: rotationPivot,
    }).geometry.coordinates as LngLatTuple;

    return getGeoJsonEllipse({
      center: rotatedCenter,
      xSemiAxis: ellipseProperties.xSemiAxis,
      ySemiAxis: ellipseProperties.ySemiAxis,
      angle: ellipseProperties.angle + deltaAngle,
    });
  }

  rotateFeature(
    featureData: FeatureData,
    shapeCentroid: LngLatTuple | undefined,
    event: GmEditMarkerMoveEvent,
  ) {
    const geoJson = cloneDeep(featureData.getGeoJson() as GeoJsonShapeFeature);
    const rotationPivot = shapeCentroid ?? geoJsonPointToLngLat(centroid(geoJson));

    const angle = this.calculateRotationAngle(rotationPivot, event.lngLatStart, event.lngLatEnd);

    geoJson.geometry = transformRotate(geoJson, angle, {
      pivot: rotationPivot,
    }).geometry;

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

  calculateMercatorRotationAngle(pivot: LngLatTuple, start: LngLatTuple, end: LngLatTuple) {
    const [pivotX, pivotY] = toMercator(pivot);
    const [startX, startY] = toMercator(start);
    const [endX, endY] = toMercator(end);

    const angleStart = Math.atan2(startY - pivotY, startX - pivotX);
    const angleEnd = Math.atan2(endY - pivotY, endX - pivotX);
    let angleDiff = angleEnd - angleStart;

    while (angleDiff <= -Math.PI) {
      angleDiff += 2 * Math.PI;
    }
    while (angleDiff > Math.PI) {
      angleDiff -= 2 * Math.PI;
    }

    return angleDiff * (180 / Math.PI);
  }

  rotateMercatorLngLat(point: LngLatTuple, pivot: LngLatTuple, angleDegrees: number): LngLatTuple {
    const [pointX, pointY] = toMercator(point);
    const [pivotX, pivotY] = toMercator(pivot);
    const angleRadians = (angleDegrees * Math.PI) / 180;
    const cosTheta = Math.cos(angleRadians);
    const sinTheta = Math.sin(angleRadians);
    const dx = pointX - pivotX;
    const dy = pointY - pivotY;

    return toWgs84([
      pivotX + dx * cosTheta - dy * sinTheta,
      pivotY + dx * sinTheta + dy * cosTheta,
    ]) as LngLatTuple;
  }
}
