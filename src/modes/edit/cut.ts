import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import {
  type EditModeName,
  type FeatureId,
  type FeatureShape,
  type LineEventHandlerArguments,
  SOURCES,
} from '@/main.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { LineDrawer } from '@/utils/draw/line-drawer.ts';
import { getBufferedOuterPolygon, isGeoJsonFeatureInPolygon } from '@/utils/features.ts';
import { getGeoJsonBounds } from '@/utils/geojson.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import booleanIntersects from '@turf/boolean-intersects';
import turfDifference from '@turf/difference';
import { featureCollection, lineString } from '@turf/helpers';
import lineSplit from '@turf/line-split';
import lineToPolygon from '@turf/line-to-polygon';
import type {
  Feature,
  LineString,
  MultiLineString,
  MultiPolygon,
  Polygon,
  Position,
} from 'geojson';
import log from 'loglevel';

type PolygonFeature = Feature<Polygon | MultiPolygon>;

export class EditCut extends BaseEdit {
  mode: EditModeName = 'cut';
  lineDrawer = new LineDrawer(this.gm, { snappingMarkers: 'first', targetShape: 'polygon' });
  cutShapesAllowed: Array<FeatureShape> = ['circle', 'ellipse', 'line', 'rectangle', 'polygon'];
  eventHandlers = {
    [`${GM_SYSTEM_PREFIX}:draw`]: this.forwardLineDrawerEvent.bind(this),
    mousemove: this.onMouseMove.bind(this),
  };

  async onStartAction() {
    await this.lineDrawer.startAction();
    this.lineDrawer.on('firstMarkerClick', this.cutPolygonFinished.bind(this));
  }

  async onEndAction() {
    await this.lineDrawer.endAction();
  }

  async onMouseMove(event: BaseMapEvent) {
    if (!isMapPointerEvent(event)) {
      return { next: true };
    }

    if (!this.lineDrawer.featureData) {
      await this.fireMarkerPointerUpdateEvent();
    }
    return { next: true };
  }

  async cutPolygonFinished(event: LineEventHandlerArguments) {
    await this.lineDrawer.endShape();
    const geoJsonPolygon = lineToPolygon(event.geoJson);
    const bBoxfeatures = this.getBBoxFeaturesByPolygon(geoJsonPolygon);
    await this.cutFeaturesByPolygon(bBoxfeatures, geoJsonPolygon);
  }

  getBBoxFeaturesByPolygon(geoJson: PolygonFeature): Array<FeatureData> {
    const coordBounds = getGeoJsonBounds(geoJson);
    const polygonScreenBounds = this.gm.mapAdapter.coordBoundsToScreenBounds(coordBounds);
    return this.gm.mapAdapter.queryFeaturesByScreenCoordinates({
      queryCoordinates: polygonScreenBounds,
      sourceNames: [SOURCES.main],
    });
  }

  async cutFeaturesByPolygon(bBoxfeatures: Array<FeatureData>, cutGeoJson: PolygonFeature) {
    for (const featureData of bBoxfeatures) {
      if (featureData.getShapeProperty('disableEdit') === true) {
        return;
      }
      if (isGeoJsonFeatureInPolygon(featureData.getGeoJson(), cutGeoJson)) {
        await this.gm.features.delete(featureData);
        await this.fireFeatureRemovedEvent(featureData);
        return;
      }

      if (!booleanIntersects(featureData.getGeoJson(), cutGeoJson)) {
        return;
      }

      if (!this.cutShapesAllowed.includes(featureData.shape)) {
        return;
      }

      if (featureData.shape === 'line') {
        await this.cutLineFeatureByPolygon(featureData, cutGeoJson);
        return;
      }

      await this.cutPolygonFeatureByPolygon(featureData.id, cutGeoJson);
    }
  }

  async cutLineFeatureByPolygon(featureData: FeatureData, cutGeoJson: PolygonFeature) {
    const shapeGeoJson = featureData.getGeoJson() as Feature<LineString | MultiLineString>;
    const bufferedCutGeoJson = getBufferedOuterPolygon(this.gm.mapAdapter, cutGeoJson);

    let isCut = false;
    let coordinates: Position[][] = [];

    if (!bufferedCutGeoJson) {
      return;
    }

    if (shapeGeoJson.geometry.type === 'MultiLineString') {
      shapeGeoJson.geometry.coordinates.forEach((lineCoordinates) => {
        if (isGeoJsonFeatureInPolygon(lineString(lineCoordinates), cutGeoJson)) {
          return;
        }

        const resultGeoJson = lineSplit(lineString(lineCoordinates), cutGeoJson);

        if (resultGeoJson.features.length === 0) {
          coordinates.push(lineCoordinates);
          return;
        }

        resultGeoJson.features
          .filter((feature) => !isGeoJsonFeatureInPolygon(feature, bufferedCutGeoJson))
          .forEach((feature) => {
            isCut = true;
            coordinates.push(feature.geometry.coordinates);
          });
      });
    } else if (shapeGeoJson.geometry.type === 'LineString') {
      const resultGeoJson = lineSplit(shapeGeoJson as Feature<LineString>, cutGeoJson);
      coordinates = resultGeoJson.features
        .filter(
          (feature) =>
            !isGeoJsonFeatureInPolygon(feature, bufferedCutGeoJson) &&
            feature.geometry.type === 'LineString',
        )
        .map((feature) => feature.geometry.coordinates);

      if (resultGeoJson.features.length > 0) {
        isCut = true;
      }
    }

    if (isCut && coordinates.length) {
      if (coordinates.length === 1) {
        await featureData.updateGeometry({ type: 'LineString', coordinates: coordinates[0] });
      } else {
        await featureData.updateGeometry({ type: 'MultiLineString', coordinates: coordinates });
      }
      await this.fireFeatureUpdatedEvent({
        sourceFeatures: [featureData],
        targetFeatures: [featureData],
      });
    }
  }

  async cutPolygonFeatureByPolygon(featureId: FeatureId, cutGeoJson: PolygonFeature) {
    const featureData = this.gm.features.get(SOURCES.main, featureId);

    if (!featureData) {
      log.warn('cutPolygonFeatureByPolygon: featureData not found', featureId);
      return;
    }

    await featureData.convertToPolygon(); // if possible
    const shapeGeoJson = featureData.getGeoJson() as PolygonFeature;
    const geoJsonDifference = this.getGeoJsonDifference(shapeGeoJson, cutGeoJson);
    if (geoJsonDifference) {
      await featureData.updateGeometry(geoJsonDifference.geometry);
      await this.fireFeatureUpdatedEvent({
        sourceFeatures: [featureData],
        targetFeatures: [featureData],
      });
    }
  }

  getGeoJsonDifference(
    shapeGeoJson: PolygonFeature,
    geoJson: PolygonFeature,
  ): Feature<Polygon | MultiPolygon> | null {
    const collection = featureCollection([shapeGeoJson, geoJson]);
    const geoJsonDiff = turfDifference(collection);

    if (!geoJsonDiff) {
      return null;
    }

    if (geoJsonDiff.type === 'Feature') {
      return geoJsonDiff;
    } else if (geoJsonDiff.type === 'FeatureCollection') {
      log.error('getGeoJsonDifference: FeatureCollection detected (not supported)', geoJsonDiff);
    }
    return null;
  }
}
