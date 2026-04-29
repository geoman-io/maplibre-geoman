import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { FEATURE_PROPERTY_PREFIX, SOURCES } from '@/core/features/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import type { MapHandlerReturnData } from '@/types/events/bus.ts';
import type { GmSystemEvent } from '@/types/events/index.ts';
import type { FeatureShape } from '@/types/features.ts';
import type { GeoJsonShapeFeature, SimplePoint } from '@/types/geojson.ts';
import type { LngLatTuple } from '@/types/map/index.ts';
import type { EditModeName } from '@/types/modes/index.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { convertToThrottled } from '@/utils/behavior.ts';
import { getFeatureFirstPoint, getMovedGeoJson, getShapeProperties } from '@/utils/features.ts';
import {
  getGeoJsonCircle,
  getGeoJsonEllipse,
  getGeoJsonFirstPoint,
  getLngLatDiff,
} from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import type { Feature, Polygon } from 'geojson';
import { isEqual } from 'lodash-es';
import log from 'loglevel';
import { moveRectangle } from '@/utils/shapes.ts';

type UpdateShapeHandler = (
  featureData: FeatureData,
  startLngLat: LngLatTuple,
  endLngLat: LngLatTuple,
) => Promise<GeoJsonShapeFeature | null> | GeoJsonShapeFeature | null;

export abstract class BaseDrag extends BaseEdit {
  mode: EditModeName = 'drag';
  initialPoint: SimplePoint | null = null;
  previousLngLat: LngLatTuple | null = null;
  linkedFeatures: Array<FeatureData> = [];

  /**
   * When true, clicking and dragging the feature body directly (not a marker)
   * will translate the entire feature. Set to false in modes that should
   * never allow body-drag translation (for example EditRotate).
   */
  bodyDragEnabled: boolean = true;

  pointBasedShapes: Array<FeatureShape> = ['marker', 'circle_marker', 'text_marker'];

  throttledMethods = convertToThrottled(
    {
      onMouseMove: this.onMouseMove,
    },
    this,
    this.gm.options.settings.throttlingDelay,
  );

  eventHandlers = {
    [`${GM_SYSTEM_PREFIX}:edit`]: this.handleGmEdit.bind(this),

    mousedown: this.onMouseDown.bind(this),
    touchstart: this.onMouseDown.bind(this),

    mousemove: this.throttledMethods.onMouseMove.bind(this),
    touchmove: this.throttledMethods.onMouseMove.bind(this),

    mouseup: this.onMouseUp.bind(this),
    touchend: this.onMouseUp.bind(this),
  };

  getUpdatedGeoJsonHandlers: { [key in FeatureShape]?: UpdateShapeHandler } = {
    marker: this.moveSource.bind(this),
    ellipse: this.moveEllipse.bind(this),
    circle: this.moveCircle.bind(this),
    circle_marker: this.moveSource.bind(this),
    text_marker: this.moveSource.bind(this),
    line: this.moveSource.bind(this),
    rectangle: this.moveRectangle.bind(this),
    polygon: this.moveSource.bind(this),
  };

  async onMouseDown(event: BaseMapEvent) {
    if (!this.bodyDragEnabled || !isMapPointerEvent(event)) {
      return { next: true };
    }
    const featureData = this.getFeatureByMouseEvent({
      event,
      sourceNames: [SOURCES.main],
    });

    if (featureData && this.getUpdatedGeoJsonHandlers[featureData.shape]) {
      if (!this.gm.features.selection.has(featureData.id)) {
        this.gm.features.setSelection([featureData.id]);
      }

      const linkedFeatures = this.gm.features.getLinkedFeatures(featureData);

      if (linkedFeatures.some((f) => f.getShapeProperty('disableEdit') === true)) {
        return { next: true };
      }

      this.initialPoint = event.point;
      this.featureData = featureData;
      this.linkedFeatures = linkedFeatures;

      this.gm.features.updateManager.beginTransaction('transactional-update');

      for (const fd of [this.featureData, ...this.linkedFeatures]) {
        await fd.changeSource({ sourceName: SOURCES.temporary });
        this.snappingHelper?.addExcludedFeature(fd);
        // Fire dragstart BEFORE setting actionInProgress and aligning shapes.
        // This ensures correct internal event ordering: dragstart -> drag -> dragend.
        // alignShapeCenterWithControlMarker calls onMouseMove which can fire drag events,
        // so dragstart must be fired first.
        await this.fireFeatureEditStartEvent({
          feature: fd,
          forceMode: 'drag',
        });
      }

      this.gm.features.updateManager.commitTransaction();
      this.gm.mapAdapter.setDragPan(false);
      this.flags.actionInProgress = true;

      if (this.isPointBasedShape()) {
        await this.alignShapeCenterWithControlMarker(this.featureData, event);
      }
      return { next: false };
    }
    return { next: true };
  }

  async onMouseUp(event: BaseMapEvent): Promise<MapHandlerReturnData> {
    if (!this.featureData || !isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }

    this.snappingHelper?.clearExcludedFeatures();

    this.gm.mapAdapter.setDragPan(true);
    this.flags.actionInProgress = false;

    this.gm.features.updateManager.beginTransaction('transactional-update');
    for (const fd of [this.featureData, ...this.linkedFeatures]) {
      await fd.changeSource({ sourceName: SOURCES.main });
      await this.fireFeatureEditEndEvent({ feature: fd, forceMode: 'drag' });
    }
    this.gm.features.updateManager.commitTransaction();

    if (this.initialPoint && this.initialPoint.dist(event.point) < 1) {
      if (event.originalEvent.ctrlKey) {
        const currentSelection = this.gm.features.selection;
        if (!currentSelection.has(this.featureData.id)) {
          this.gm.features.setSelection([...currentSelection, this.featureData.id], true);
        }
      } else {
        this.gm.features.setSelection([this.featureData.id], true);
      }
    }

    this.initialPoint = null;
    this.previousLngLat = null;
    this.featureData = null;
    this.linkedFeatures = [];
    return { next: true };
  }

  async onMouseMove(event: BaseMapEvent) {
    if (!this.flags.actionInProgress || !isMapPointerEvent(event, { warning: true })) {
      return { next: true };
    }

    if (this.featureData) {
      // marker pointer is automatically enabled when the drag starts
      // see "relatedModes" in options
      const lngLatEnd = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();
      const lngLatStart = this.previousLngLat ?? lngLatEnd;

      this.gm.features.updateManager.beginTransaction('transactional-update', SOURCES.temporary);

      for (const fd of this.linkedFeatures) {
        await this.moveFeature(fd, lngLatStart, lngLatEnd);
      }

      const isUpdated = await this.moveFeature(this.featureData, lngLatStart, lngLatEnd);
      this.gm.features.updateManager.commitTransaction(SOURCES.temporary);

      if (isUpdated) {
        this.previousLngLat = lngLatEnd;
      }
    }
    return { next: false };
  }

  isPointBasedShape(): boolean {
    // snapping should be enabled only for point based geometries
    // but shape markers provide its own snapping too
    return !!this.featureData && this.pointBasedShapes.includes(this.featureData.shape);
  }

  abstract handleGmEdit(event: GmSystemEvent): Promise<MapHandlerReturnData> | MapHandlerReturnData;

  async alignShapeCenterWithControlMarker(featureData: FeatureData, event: BaseMapEvent) {
    const shapeLngLat = getFeatureFirstPoint(featureData);
    if (shapeLngLat) {
      this.gm.markerPointer.marker?.setLngLat(shapeLngLat);
      await this.onMouseMove(event); // align control marker and feature center
    }
  }

  async moveFeature(featureData: FeatureData, startLngLat: LngLatTuple, endLngLat: LngLatTuple) {
    if (!this.flags.actionInProgress) {
      return false;
    }

    const customDragHandlerFunc = this.gm.options.settings.customDragHandler;
    let updatedGeoJson: Promise<GeoJsonShapeFeature | null> | GeoJsonShapeFeature | null = null;

    if (customDragHandlerFunc) {
      updatedGeoJson = customDragHandlerFunc({ featureData, startLngLat, endLngLat });
    }

    if (!updatedGeoJson) {
      const shapeUpdateMethod = this.getUpdatedGeoJsonHandlers[featureData.shape];
      updatedGeoJson = shapeUpdateMethod?.(featureData, startLngLat, endLngLat) ?? null;
      if (updatedGeoJson instanceof Promise) {
        updatedGeoJson = await updatedGeoJson;
      }
    }

    if (!updatedGeoJson) {
      log.error('BaseDrag.moveFeature: invalid updatedGeoJson', featureData);
      return false;
    }

    await this.fireBeforeFeatureUpdate({
      features: [featureData],
      geoJsonFeatures: [updatedGeoJson],
      forceMode: 'drag',
    });

    const isUpdated = await this.updateFeatureGeoJson({
      featureData,
      featureGeoJson: updatedGeoJson,
      forceMode: 'drag',
    });

    if (!isEqual(featureData.getGeoJson().properties, updatedGeoJson.properties)) {
      await featureData._updateAllProperties(updatedGeoJson.properties);
    }

    return isUpdated;
  }

  moveSource(featureData: FeatureData, startLngLat: LngLatTuple, endLngLat: LngLatTuple) {
    return getMovedGeoJson(featureData, getLngLatDiff(startLngLat, endLngLat));
  }

  moveRectangle(
    featureData: FeatureData,
    startLngLat: LngLatTuple,
    endLngLat: LngLatTuple,
  ): GeoJsonShapeFeature | null {
    if (featureData.shape !== 'rectangle') {
      log.error('BaseDrag.moveRectangle: invalid shape type', featureData);
      return null;
    }

    const lngLatDiff = getLngLatDiff(startLngLat, endLngLat);
    const shapeProperties = getShapeProperties(featureData.getGeoJson(), 'rectangle');

    if (!shapeProperties) {
      // Fallback for legacy rectangles without intrinsic properties
      log.warn("BaseDrag.moveRectangle: properties aren't valid", featureData);
      return getMovedGeoJson(featureData, lngLatDiff);
    }

    return moveRectangle(featureData.getGeoJson(), [
      shapeProperties.center[0] + lngLatDiff.lng,
      shapeProperties.center[1] + lngLatDiff.lat,
    ]);
  }

  moveEllipse(
    featureData: FeatureData,
    startLngLat: LngLatTuple,
    endLngLat: LngLatTuple,
  ): GeoJsonShapeFeature | null {
    if (featureData.shape !== 'ellipse') {
      log.error('BaseDrag.moveCircle: invalid shape type', featureData);
      return null;
    }

    const ellipseProperties = getShapeProperties(featureData.getGeoJson(), 'ellipse');
    if (!ellipseProperties) {
      log.error('BaseDrag.moveEllipse: wrong properties', featureData.getGeoJson());
      return null;
    }

    const lngLatDiff = getLngLatDiff(startLngLat, endLngLat);

    const newCenterCoords: LngLatTuple = [
      ellipseProperties.center[0] + lngLatDiff.lng,
      ellipseProperties.center[1] + lngLatDiff.lat,
    ];

    return getGeoJsonEllipse({
      center: newCenterCoords,
      xSemiAxis: ellipseProperties.xSemiAxis,
      ySemiAxis: ellipseProperties.ySemiAxis,
      angle: ellipseProperties.angle,
    });
  }

  async moveCircle(
    featureData: FeatureData,
    startLngLat: LngLatTuple,
    endLngLat: LngLatTuple,
  ): Promise<GeoJsonShapeFeature | null> {
    if (featureData.shape !== 'circle') {
      log.error('BaseDrag.moveCircle: invalid shape type', featureData);
      return null;
    }

    const circleProperties = getShapeProperties(featureData.getGeoJson(), 'circle');
    if (!circleProperties) {
      log.error('BaseDrag.moveCircle: wrong properties', featureData.getGeoJson());
      return null;
    }

    const geoJson = featureData.getGeoJson() as Feature<Polygon>;
    const circleRimLngLat = getGeoJsonFirstPoint(geoJson);
    if (!circleRimLngLat) {
      log.error('BaseDrag.moveCircle: missing center circleRimLngLat');
      return null;
    }

    const lngLatDiff = getLngLatDiff(startLngLat, endLngLat);
    const newCenterCoords: LngLatTuple = [
      circleProperties.center[0] + lngLatDiff.lng,
      circleProperties.center[1] + lngLatDiff.lat,
    ];
    await featureData.setShapeProperty('center', newCenterCoords);

    const circlePolygon = getGeoJsonCircle({
      center: newCenterCoords,
      radius: this.gm.mapAdapter.getDistance(circleProperties.center, circleRimLngLat),
    });

    return {
      type: 'Feature',
      properties: {
        [`${FEATURE_PROPERTY_PREFIX}shape`]: 'circle',
        [`${FEATURE_PROPERTY_PREFIX}center`]: newCenterCoords,
      },
      geometry: circlePolygon.geometry,
    };
  }
}
