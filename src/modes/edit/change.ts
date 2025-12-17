import {
  type EditModeName,
  type FeatureShape,
  type GeoJsonShapeFeature,
  type GmEditMarkerEvent,
  type GmEditMarkerMoveEvent,
  type GmSystemEvent,
  type LngLatTuple,
  type MapHandlerReturnData,
  type MarkerData,
  SOURCES,
} from '@/main.ts';
import { BaseDrag } from '@/modes/edit/base-drag.ts';
import { getFeatureFirstPoint } from '@/utils/features.ts';
import {
  ellipseSteps,
  findCoordinateIndices,
  getGeoJsonCircle,
  getGeoJsonCoordinatesCount,
  getGeoJsonEllipse,
  getLngLatDiff,
  isLineStringFeature,
  isMultiPolygonFeature,
  isPolygonFeature,
  removeVertexFromGeoJsonFeature,
  twoCoordsToGeoJsonRectangle,
} from '@/utils/geojson.ts';
import { isGmEditEvent } from '@/utils/guards/modes.ts';
import { toMod } from '@/utils/number.ts';
import type { Feature, LineString, MultiPolygon, Polygon } from 'geojson';
import { cloneDeep, get } from 'lodash-es';
import log from 'loglevel';
import { isSnapGuidesHelper } from '@/utils/guards/interfaces.ts';

type UpdateShapeHandler = (event: GmEditMarkerMoveEvent) => GeoJsonShapeFeature | null;

export class EditChange extends BaseDrag {
  mode: EditModeName = 'change';
  cutVertexShapeTypes: Array<FeatureShape> = ['line', 'polygon', 'rectangle'];
  markerData: MarkerData | null = null;

  shapeUpdateHandlers: { [key in FeatureShape]?: UpdateShapeHandler } = {
    marker: this.updateSingleVertex.bind(this),
    circle: this.updateCircle.bind(this),
    circle_marker: this.updateSingleVertex.bind(this),
    ellipse: this.updateEllipse.bind(this),
    text_marker: this.updateSingleVertex.bind(this),
    line: this.updateSingleVertex.bind(this),
    rectangle: this.updateRectangle.bind(this),
    polygon: this.updateSingleVertex.bind(this),
  };

  get snapGuidesInstance() {
    const instance = this.gm.actionInstances.helper__snap_guides;
    return isSnapGuidesHelper(instance) ? instance : null;
  }

  onStartAction() {
    // ...
  }

  onEndAction() {
    this.snapGuidesInstance?.removeSnapGuides();
  }

  handleGmEdit(event: GmSystemEvent): MapHandlerReturnData {
    if (!isGmEditEvent(event)) {
      return { next: true };
    }

    if (event.action === 'marker_move' && event.lngLatStart && event.markerData) {
      if (event.markerData.type === 'vertex') {
        this.moveVertex(event);
        return { next: false };
      } else if (event.lngLatEnd) {
        const lngLatDiff = getLngLatDiff(event.lngLatStart, event.lngLatEnd);
        this.moveSource(event.featureData, lngLatDiff);
        return { next: false };
      }
    }

    if (event.action === 'marker_right_click') {
      this.cutVertex(event);
      this.fireFeatureEditEndEvent({ feature: event.featureData });
    } else if (event.action === 'edge_marker_click') {
      this.insertVertex(event);
    } else if (event.action === 'marker_captured') {
      this.setCursorToPointer();
      event.featureData.changeSource({ sourceName: SOURCES.temporary, atomic: true });
      this.flags.actionInProgress = true;
      this.fireFeatureEditStartEvent({ feature: event.featureData });
    } else if (event.action === 'marker_released') {
      this.markerData = null;
      this.snapGuidesInstance?.removeSnapGuides();
      event.featureData.changeSource({ sourceName: SOURCES.main, atomic: true });
      this.fireFeatureEditEndEvent({ feature: event.featureData });
      this.flags.actionInProgress = false;
    }

    return { next: true };
  }

  moveVertex(event: GmEditMarkerMoveEvent) {
    if (!this.markerData) {
      this.markerData = event.markerData || null;
      this.snapGuidesInstance?.updateSnapGuides(event.featureData.getGeoJson(), event.lngLatStart);
    }

    const featureData = event.featureData;
    const shape = featureData.shape;
    const updatedGeoJson = this.shapeUpdateHandlers[shape]?.(event) || null;

    if (updatedGeoJson) {
      this.fireBeforeFeatureUpdate({
        features: [featureData],
        geoJsonFeatures: [updatedGeoJson],
      });

      this.updateFeatureGeoJson({ featureData, featureGeoJson: updatedGeoJson });
    } else {
      log.error('EditChange.moveVertex: invalid geojson', updatedGeoJson, event);
    }
  }

  cutVertex(event: GmEditMarkerEvent) {
    const featureData = event.featureData;
    if (event.markerData.type !== 'vertex') {
      return;
    }

    if (!this.cutVertexShapeTypes.includes(featureData.shape)) {
      return;
    }

    let featureUpdated = false;
    type CutFeature = Feature<LineString | Polygon | MultiPolygon>;
    const geoJson = featureData.getGeoJson() as CutFeature;
    const marker = event.markerData.instance;

    if (isLineStringFeature(geoJson)) {
      if (getGeoJsonCoordinatesCount(geoJson) <= 2) {
        this.gm.features.delete(featureData);
        return;
      }
    } else if (isMultiPolygonFeature(geoJson)) {
      if (getGeoJsonCoordinatesCount(geoJson) <= 3) {
        this.gm.features.delete(featureData);
        return;
      }
    } else if (isPolygonFeature(geoJson)) {
      if (getGeoJsonCoordinatesCount(geoJson) <= 3) {
        this.gm.features.delete(featureData);
        return;
      }
    }

    const markerPosition = getFeatureFirstPoint(marker);
    if (markerPosition) {
      featureUpdated = removeVertexFromGeoJsonFeature(geoJson, markerPosition);
    }

    if (featureUpdated) {
      featureData.convertToPolygon(); // if possible
      featureData.updateGeoJsonGeometry(geoJson.geometry);
      this.fireFeatureUpdatedEvent({
        sourceFeatures: [featureData],
        targetFeatures: [featureData],
        markerData: event.markerData,
      });
    } else {
      log.error('EditChange.cutVertex: feature not updated', event);
    }
  }

  insertVertex(event: GmEditMarkerEvent) {
    if (event.markerData.type !== 'edge') {
      return;
    }

    type InsertFeature = Feature<LineString | Polygon | MultiPolygon>;
    const geoJson = event.featureData.getGeoJson() as InsertFeature;

    const coordinatesPath = event.markerData.segment.end.path;
    const insertIndex = coordinatesPath.pop();
    const coordinates = get(geoJson, coordinatesPath) as Array<LngLatTuple>;

    if (typeof insertIndex === 'number') {
      coordinates.splice(insertIndex, 0, [...event.markerData.position.coordinate]);
      event.featureData.updateGeoJsonGeometry(geoJson.geometry);
      event.featureData.convertToPolygon(); // if possible
      this.fireFeatureUpdatedEvent({
        sourceFeatures: [event.featureData],
        targetFeatures: [event.featureData],
        markerData: event.markerData,
      });
    }
  }

  updateSingleVertex({ featureData, lngLatEnd, markerData }: GmEditMarkerMoveEvent) {
    const geoJson = cloneDeep(featureData.getGeoJson() as GeoJsonShapeFeature);
    const coordPath = cloneDeep(markerData.position.path);
    const coordIndex = coordPath.pop();
    const coordinates = get(geoJson, coordPath) as Array<LngLatTuple>;

    if (Array.isArray(coordinates) && typeof coordIndex === 'number') {
      coordinates[coordIndex] = [...lngLatEnd];
      if (coordIndex === 0 && featureData.shape === 'polygon') {
        coordinates[coordinates.length - 1] = [...lngLatEnd];
      }
    } else {
      log.error('BaseDrag.moveSingleVertex: invalid coordinates', geoJson, coordPath);
    }

    return geoJson;
  }

  updateCircle({ featureData, lngLatEnd }: GmEditMarkerMoveEvent): GeoJsonShapeFeature | null {
    const shapeCenter = featureData.getShapeProperty('center');

    if (featureData.shape !== 'circle' || !shapeCenter) {
      log.error('BaseDrag.moveCircle: invalid shape type / missing center', featureData);
      return null;
    }

    const circlePolygon = getGeoJsonCircle({
      center: shapeCenter,
      radius: this.gm.mapAdapter.getDistance(shapeCenter, lngLatEnd),
    });

    return circlePolygon;
  }

  updateEllipse(args: GmEditMarkerMoveEvent): GeoJsonShapeFeature | null {
    const { featureData, lngLatEnd, markerData } = args;
    if (featureData.shape !== 'ellipse') {
      log.error('EditChange.updateEllipse: invalid shape type', featureData);
      return null;
    }

    const center = featureData.getShapeProperty('center');
    let xSemiAxis = featureData.getShapeProperty('xSemiAxis');
    let ySemiAxis = featureData.getShapeProperty('ySemiAxis');
    const angle = featureData.getShapeProperty('angle');

    if (
      !Array.isArray(center) ||
      typeof xSemiAxis !== 'number' ||
      typeof ySemiAxis !== 'number' ||
      typeof angle !== 'number'
    ) {
      log.error(
        'updateEllipse: missing center, xSemiAxis, ySemiAxis or angle in the featureData',
        featureData,
      );
      return null;
    }

    const distance = this.gm.mapAdapter.getDistance(center, lngLatEnd);

    const vertexIdx = markerData.position.path[3] as number;
    const vertexRatio = Math.floor((vertexIdx / ellipseSteps) * 4);

    const axe = vertexRatio === 0 || vertexRatio === 2 ? 'x' : 'y';
    if (axe === 'x') {
      xSemiAxis = distance;
    } else {
      ySemiAxis = distance;
    }

    const ellipsePolygon = getGeoJsonEllipse({
      center,
      xSemiAxis,
      ySemiAxis,
      angle,
    });

    return ellipsePolygon;
  }

  updateRectangle({ featureData, lngLatStart, lngLatEnd }: GmEditMarkerMoveEvent) {
    const totalCoordsCount = 4;
    const geoJson = featureData.getGeoJson() as GeoJsonShapeFeature;
    const shapeCoords = geoJson.geometry.coordinates[0] as Array<LngLatTuple>;

    // Find the index of the starting vertex
    const { absCoordIndex: startIndex } = findCoordinateIndices(geoJson, lngLatStart);
    if (startIndex === -1) {
      log.error('EditChange.updateRectangle: start vertex not found', featureData);
      return null;
    }

    const oppositeVertexIndex = toMod(startIndex - 2, totalCoordsCount);
    const oppositeCoordinate = shapeCoords[oppositeVertexIndex] as LngLatTuple;
    return twoCoordsToGeoJsonRectangle(lngLatEnd, oppositeCoordinate);
  }
}
