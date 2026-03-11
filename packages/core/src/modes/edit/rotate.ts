import { SOURCES } from '@/core/features/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import type { GmEditEvent, GmEditMarkerMoveEvent } from '@/types/events/edit.ts';
import type { GmSystemEvent } from '@/types/events/index.ts';
import type { FeatureShape } from '@/types/features.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLatTuple, ScreenPoint } from '@/types/map/index.ts';
import type { EditModeName, ShapeName } from '@/types/modes/index.ts';
import { BaseDrag } from '@/modes/edit/base-drag.ts';
import { getShapeProperties } from '@/utils/features.ts';
import {
  eachCoordinateWithPath,
  geoJsonPointToLngLat,
  getGeoJsonCircle,
  getGeoJsonEllipse,
  getGeoJsonFirstPoint,
  isEqualPosition,
} from '@/utils/geojson.ts';
import { isGmEditEvent } from '@/utils/guards/modes.ts';
import bearing from '@turf/bearing';
import centroid from '@turf/centroid';
import { featureCollection, point } from '@turf/helpers';
import transformRotate from '@turf/transform-rotate';
import type { Feature, Polygon } from 'geojson';
import { cloneDeep, isEqual } from 'lodash-es';
import log from 'loglevel';
import { calculateEuclideanRotationAngle } from '@/utils/planar.ts';

type RotateShapeHandler = (
  featureData: FeatureData,
  shapeCentroid: LngLatTuple,
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
    rectangle: this.rotateFeature.bind(this),
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
    const shapeCentroid = geoJsonPointToLngLat(
      centroid(
        featureCollection([
          event.featureData.getGeoJson(),
          ...(event.linkedFeatures ?? []).map((fd) => fd.getGeoJson()),
        ]),
      ),
    );

    for (const featureData of [event.featureData, ...(event.linkedFeatures ?? [])]) {
      const updatedGeoJson =
        this.shapeRotateHandlers[featureData.shape]?.(featureData, shapeCentroid, event) || null;

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
    shapeCentroid: LngLatTuple,
    event: GmEditMarkerMoveEvent,
  ) {
    if (featureData.shape !== 'rectangle') {
      log.error('EditRotate.rotateRectangle: invalid shape type', featureData);
      return null;
    }

    const geoJson = cloneDeep(featureData.getGeoJson());
    const rectanglePoints: Array<ScreenPoint> = [];
    const startPoint = this.gm.mapAdapter.project(event.lngLatStart);
    const endPoint = this.gm.mapAdapter.project(event.lngLatEnd);

    eachCoordinateWithPath(geoJson, (position) => {
      rectanglePoints.push(this.gm.mapAdapter.project(position.coordinate));
    });

    if (rectanglePoints.length !== 5) {
      log.error('EditRotate.rotateRectangle: invalid geojson', featureData);
      return null;
    }

    const externalCenterPoint = this.gm.mapAdapter.project(shapeCentroid);
    let centerPoint: ScreenPoint = [
      (rectanglePoints[0][0] + rectanglePoints[2][0]) / 2,
      (rectanglePoints[0][1] + rectanglePoints[2][1]) / 2,
    ];

    if (!isEqual(centerPoint, externalCenterPoint)) {
      centerPoint = externalCenterPoint;
    }

    const deltaAngle = calculateEuclideanRotationAngle(startPoint, endPoint, centerPoint);

    return this.euclideanRotateByAngle(geoJson, centerPoint, deltaAngle);
  }

  rotateCircle(featureData: FeatureData, shapeCentroid: LngLatTuple, event: GmEditMarkerMoveEvent) {
    if (featureData.shape !== 'circle') {
      log.error('EditRotate.rotateCircle: invalid shape type', featureData);
      return null;
    }

    const circleProperties = getShapeProperties(featureData.getGeoJson(), 'circle');
    if (!circleProperties) {
      log.error('rotateCircle: wrong properties', featureData.getGeoJson());
      return null;
    }

    if (isEqualPosition(shapeCentroid, circleProperties.center)) {
      return featureData.getGeoJson();
    }

    const deltaAngle = this.calculateRotationAngle(
      shapeCentroid,
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
      pivot: shapeCentroid,
    }).geometry.coordinates as LngLatTuple;
    const radius = this.gm.mapAdapter.getDistance(circleProperties.center, circleRimLngLat);

    return getGeoJsonCircle({ center: rotatedCenter, radius }) as GeoJsonShapeFeature;
  }

  rotateEllipse(
    featureData: FeatureData,
    shapeCentroid: LngLatTuple,
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

    const deltaAngle = this.calculateRotationAngle(
      shapeCentroid,
      event.lngLatStart,
      event.lngLatEnd,
      false,
    );

    const rotatedCenter = transformRotate(point(ellipseProperties.center), deltaAngle, {
      pivot: shapeCentroid,
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
    shapeCentroid: LngLatTuple,
    event: GmEditMarkerMoveEvent,
  ) {
    const geoJson = cloneDeep(featureData.getGeoJson() as GeoJsonShapeFeature);

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

  euclideanRotateByAngle(
    geoJson: GeoJsonShapeFeature,
    pivotPoint: ScreenPoint,
    angleDegrees: number,
  ): GeoJsonShapeFeature {
    const resultGeoJson: GeoJsonShapeFeature = cloneDeep(geoJson);

    // 1. Convert degrees to radians
    const angleRadians = angleDegrees * (Math.PI / 180);
    const cosTheta = Math.cos(angleRadians);
    const sinTheta = Math.sin(angleRadians);

    // 2. Iterate through each coordinate
    eachCoordinateWithPath(
      resultGeoJson,
      (position) => {
        // Project geographical coordinate to screen space
        const point = this.gm.mapAdapter.project(position.coordinate);

        // Calculate distance from pivot point
        const dx = point[0] - pivotPoint[0];
        const dy = point[1] - pivotPoint[1];

        // Apply rotation matrix
        const rotatedX = dx * cosTheta - dy * sinTheta;
        const rotatedY = dx * sinTheta + dy * cosTheta;

        // Translate back relative to the pivot point
        point[0] = pivotPoint[0] + rotatedX;
        point[1] = pivotPoint[1] + rotatedY;

        // Unproject back to geographical coordinate
        const lngLat = this.gm.mapAdapter.unproject(point);
        position.coordinate[0] = lngLat[0];
        position.coordinate[1] = lngLat[1];
      },
      true,
    );

    return resultGeoJson;
  }
}
