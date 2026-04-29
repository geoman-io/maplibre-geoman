import { FEATURE_PROPERTY_PREFIX, SOURCES } from '@/core/features/constants.ts';
import type { GmEditMarkerEvent, GmEditMarkerMoveEvent } from '@/types/events/edit.ts';
import type { GmSystemEvent } from '@/types/events/index.ts';
import type { FeatureShape } from '@/types/features.ts';
import type { GeoJsonShapeFeature } from '@/types/geojson.ts';
import type { LngLatTuple } from '@/types/map/index.ts';
import type { EditModeName, MarkerData } from '@/types/modes/index.ts';
import { BaseDrag } from '@/modes/edit/base-drag.ts';
import { getFeatureFirstPoint, getShapeProperties } from '@/utils/features.ts';
import {
  ellipseSteps,
  getGeoJsonCircle,
  getGeoJsonCoordinatesCount,
  getGeoJsonEllipse,
  isLineStringFeature,
  isMultiPolygonFeature,
  isPolygonFeature,
  removeVertexFromGeoJsonFeature,
} from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import { isGmEditEvent } from '@/utils/guards/modes.ts';
import { toMod } from '@/utils/number.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import type { Feature, LineString, MultiPolygon, Polygon } from 'geojson';
import { cloneDeep, get } from 'lodash-es';
import log from 'loglevel';
import { isSnapGuidesHelper } from '@/utils/guards/interfaces.ts';
import {
  getRectangleCornerCoordinates,
  getRectanglePropertiesFromDiagonal,
} from '@/utils/shapes.ts';

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

  override async onMouseDown(event: BaseMapEvent) {
    if (!isMapPointerEvent(event)) {
      return { next: true };
    }

    if (this.getSettingValue('bodyDragEnabled') === true) {
      return await super.onMouseDown(event);
    }

    const featureData = this.getFeatureByMouseEvent({ event, sourceNames: [SOURCES.main] });
    if (!featureData || !this.pointBasedShapes.includes(featureData.shape)) {
      return { next: true };
    }

    return await super.onMouseDown(event);
  }

  async handleGmEdit(event: GmSystemEvent) {
    if (!isGmEditEvent(event)) {
      return { next: true };
    }

    if (event.action === 'marker_move' && event.lngLatStart && event.markerData) {
      if (event.markerData.type === 'vertex') {
        await this.moveVertex(event);
        return { next: false };
      } else if (event.lngLatEnd) {
        this.moveSource(event.featureData, event.lngLatStart, event.lngLatEnd);
        return { next: false };
      }
    }

    if (event.action === 'marker_right_click') {
      await this.cutVertex(event);
      await this.fireFeatureEditEndEvent({ feature: event.featureData });
    } else if (event.action === 'edge_marker_click') {
      await this.insertVertex(event);
    } else if (event.action === 'marker_captured') {
      this.setCursorToPointer();
      await event.featureData.changeSource({ sourceName: SOURCES.temporary });
      this.flags.actionInProgress = true;
      await this.fireFeatureEditStartEvent({ feature: event.featureData });
    } else if (event.action === 'marker_released') {
      this.markerData = null;
      this.snapGuidesInstance?.removeSnapGuides();
      await event.featureData.changeSource({ sourceName: SOURCES.main });
      await this.fireFeatureEditEndEvent({ feature: event.featureData });
      this.flags.actionInProgress = false;
    }

    return { next: true };
  }

  async moveVertex(event: GmEditMarkerMoveEvent) {
    if (!this.markerData) {
      this.markerData = event.markerData || null;
      this.snapGuidesInstance?.updateSnapGuides(event.featureData.getGeoJson(), event.lngLatStart);
    }

    const featureData = event.featureData;
    const shape = featureData.shape;

    const customVertexUpdateHandlerFunc = this.gm.options.settings.customVertexUpdateHandler;

    let updatedGeoJson: GeoJsonShapeFeature | null = null;

    if (customVertexUpdateHandlerFunc) {
      updatedGeoJson = customVertexUpdateHandlerFunc(event);
    }

    if (!updatedGeoJson) {
      updatedGeoJson = this.shapeUpdateHandlers[shape]?.(event) || null;
    }

    if (updatedGeoJson) {
      await this.fireBeforeFeatureUpdate({
        features: [featureData],
        geoJsonFeatures: [updatedGeoJson],
      });

      await this.updateFeatureGeoJson({ featureData, featureGeoJson: updatedGeoJson });
    } else {
      log.error('EditChange.moveVertex: invalid geojson', updatedGeoJson, event);
    }
  }

  async cutVertex(event: GmEditMarkerEvent) {
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
        await this.gm.features.delete(featureData);
        return;
      }
    } else if (isMultiPolygonFeature(geoJson)) {
      if (getGeoJsonCoordinatesCount(geoJson) <= 3) {
        await this.gm.features.delete(featureData);
        return;
      }
    } else if (isPolygonFeature(geoJson)) {
      if (getGeoJsonCoordinatesCount(geoJson) <= 3) {
        await this.gm.features.delete(featureData);
        return;
      }
    }

    const markerPosition = getFeatureFirstPoint(marker);
    if (markerPosition) {
      featureUpdated = removeVertexFromGeoJsonFeature(geoJson, markerPosition);
    }

    if (featureUpdated) {
      await featureData.convertToPolygon(); // if possible
      await featureData.updateGeometry(geoJson.geometry);
      await this.fireFeatureUpdatedEvent({
        sourceFeatures: [featureData],
        targetFeatures: [featureData],
        markerData: event.markerData,
      });
    } else {
      log.error('EditChange.cutVertex: feature not updated', event);
    }
  }

  async insertVertex(event: GmEditMarkerEvent) {
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
      await event.featureData.updateGeometry(geoJson.geometry);
      await event.featureData.convertToPolygon(); // if possible
      await this.fireFeatureUpdatedEvent({
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
    if (featureData.shape !== 'circle') {
      log.error('BaseDrag.moveCircle: invalid shape type / missing center', featureData);
      return null;
    }

    const circleProperties = getShapeProperties(featureData.getGeoJson(), 'circle');
    if (!circleProperties) {
      log.error('BaseDrag.moveCircle: wrong properties', featureData.getGeoJson());
      return null;
    }

    const circlePolygon = getGeoJsonCircle({
      center: circleProperties.center,
      radius: this.gm.mapAdapter.getDistance(circleProperties.center, lngLatEnd),
    });

    return {
      type: 'Feature',
      properties: {
        [`${FEATURE_PROPERTY_PREFIX}shape`]: 'circle',
        [`${FEATURE_PROPERTY_PREFIX}center`]: circleProperties.center,
      },
      geometry: circlePolygon.geometry,
    };
  }

  updateEllipse(args: GmEditMarkerMoveEvent): GeoJsonShapeFeature | null {
    const { featureData, lngLatEnd, markerData } = args;
    if (featureData.shape !== 'ellipse') {
      log.error('EditChange.updateEllipse: invalid shape type', featureData);
      return null;
    }

    const ellipseProperties = getShapeProperties(featureData.getGeoJson(), 'ellipse');
    if (!ellipseProperties) {
      log.error('updateEllipse: wrong properties', featureData);
      return null;
    }

    const distance = this.gm.mapAdapter.getDistance(ellipseProperties.center, lngLatEnd);
    let xSemiAxis = ellipseProperties.xSemiAxis;
    let ySemiAxis = ellipseProperties.ySemiAxis;

    const vertexIdx = markerData.position.path[3] as number;
    const vertexRatio = Math.floor((vertexIdx / ellipseSteps) * 4);

    const axe = vertexRatio === 0 || vertexRatio === 2 ? 'x' : 'y';
    if (axe === 'x') {
      xSemiAxis = distance;
    } else {
      ySemiAxis = distance;
    }

    return getGeoJsonEllipse({
      center: ellipseProperties.center,
      xSemiAxis,
      ySemiAxis,
      angle: ellipseProperties.angle,
    });
  }

  updateRectangle(event: GmEditMarkerMoveEvent) {
    const TOTAL_COORDS_COUNT = 4;
    const geoJson = event.featureData.getGeoJson();
    const shapeCoords = geoJson.geometry.coordinates[0] as Array<LngLatTuple>;

    const properties = getShapeProperties(geoJson, 'rectangle');
    if (!properties) {
      log.error('updateRectangle: wrong properties', event.featureData);
      return null;
    }

    const startIndex = event.markerData.position.path.at(-1);
    if (typeof startIndex !== 'number') {
      log.error('EditChange.updateRectangle: start vertex not found', event.featureData);
      return null;
    }

    const oppositeVertexIndex = toMod(startIndex - 2, TOTAL_COORDS_COUNT);
    const oppositeCoordinate = shapeCoords[oppositeVertexIndex] as LngLatTuple;
    if (!oppositeCoordinate) {
      log.error('EditChange.updateRectangle: opposite vertex not found', event.featureData);
      return null;
    }

    const {
      center: newCenter,
      width: newWidth,
      height: newHeight,
    } = getRectanglePropertiesFromDiagonal({
      draggedCorner: event.lngLatEnd,
      oppositeCorner: oppositeCoordinate,
      angle: properties.angle,
    });

    const corners = getRectangleCornerCoordinates({
      center: newCenter,
      width: newWidth,
      height: newHeight,
      angle: properties.angle,
    });

    return {
      ...geoJson,
      properties: {
        ...geoJson.properties,
        [`${FEATURE_PROPERTY_PREFIX}center`]: newCenter,
        [`${FEATURE_PROPERTY_PREFIX}width`]: newWidth,
        [`${FEATURE_PROPERTY_PREFIX}height`]: newHeight,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[...corners, corners[0]]],
      },
    } as GeoJsonShapeFeature;
  }
}
