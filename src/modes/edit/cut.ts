import { FeatureData } from '@/core/features/feature-data.ts';
import {
  type AnyEvent,
  type EditModeName,
  type FeatureId,
  type FeatureShape,
  type GeoJsonShapeFeature,
  type LineEventHandlerArguments,
  SOURCES,
} from '@/main.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { LineDrawer } from '@/utils/draw/line-drawer.ts';
import { getBufferedOuterPolygon, isGeoJsonFeatureInPolygon } from '@/utils/features.ts';
import { getGeoJsonBounds } from '@/utils/geojson.ts';
import { isNonEmptyArray } from '@/utils/guards/index.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import booleanIntersects from '@turf/boolean-intersects';
import turfClone from '@turf/clone';
import turfDifference from '@turf/difference';
import { featureCollection } from '@turf/helpers';
import lineSplit from '@turf/line-split';
import lineToPolygon from '@turf/line-to-polygon';
import type { Feature, LineString, MultiPolygon, Polygon } from 'geojson';
import log from 'loglevel';
import { GM_PREFIX } from '@/core/constants.ts';

type PolygonFeature = Feature<Polygon | MultiPolygon>;

export class EditCut extends BaseEdit {
  mode: EditModeName = 'cut';
  lineDrawer = new LineDrawer(this.gm, { snappingMarkers: 'first', targetShape: 'polygon' });
  cutShapesAllowed: Array<FeatureShape> = ['circle', 'ellipse', 'line', 'rectangle', 'polygon'];
  eventHandlers = {
    [`${GM_PREFIX}:draw`]: this.forwardLineDrawerEvent.bind(this),
    mousemove: this.onMouseMove.bind(this),
  };

  onStartAction() {
    this.lineDrawer.startAction();
    this.lineDrawer.on('firstMarkerClick', this.cutPolygonFinished.bind(this));
  }

  onEndAction() {
    this.lineDrawer.endAction();
  }

  onMouseMove(event: AnyEvent) {
    if (!isMapPointerEvent(event)) {
      return { next: true };
    }

    if (!this.lineDrawer.featureData) {
      this.fireMarkerPointerUpdateEvent();
    }
    return { next: true };
  }

  cutPolygonFinished(event: LineEventHandlerArguments) {
    this.lineDrawer.endShape();
    const geoJsonPolygon = lineToPolygon(event.geoJson);
    const bBoxfeatures = this.getBBoxFeaturesByPolygon(geoJsonPolygon);
    this.cutFeaturesByPolygon(bBoxfeatures, geoJsonPolygon);
  }

  getBBoxFeaturesByPolygon(geoJson: PolygonFeature): Array<FeatureData> {
    const coordBounds = getGeoJsonBounds(geoJson);
    const polygonScreenBounds = this.gm.mapAdapter.coordBoundsToScreenBounds(coordBounds);
    return this.gm.mapAdapter.queryFeaturesByScreenCoordinates({
      queryCoordinates: polygonScreenBounds,
      sourceNames: [SOURCES.main],
    });
  }

  cutFeaturesByPolygon(bBoxfeatures: Array<FeatureData>, cutGeoJson: PolygonFeature) {
    bBoxfeatures.forEach((featureData) => {
      if (isGeoJsonFeatureInPolygon(featureData.getGeoJson(), cutGeoJson)) {
        this.gm.features.delete(featureData);
        this.fireFeatureRemovedEvent(featureData);
        return;
      }

      if (!booleanIntersects(featureData.getGeoJson(), cutGeoJson)) {
        return;
      }

      if (!this.cutShapesAllowed.includes(featureData.shape)) {
        return;
      }

      if (featureData.shape === 'line') {
        this.cutLineFeatureByPolygon(featureData, cutGeoJson);
        return;
      }

      this.cutPolygonFeatureByPolygon(featureData.id, cutGeoJson);
    });
  }

  cutLineFeatureByPolygon(featureData: FeatureData, cutGeoJson: PolygonFeature) {
    const shapeGeoJson = featureData.getGeoJson() as Feature<LineString>;
    const bufferedCutGeoJson = getBufferedOuterPolygon(this.gm.mapAdapter, cutGeoJson);
    const resultGeoJson = lineSplit(shapeGeoJson, cutGeoJson);

    if (!bufferedCutGeoJson || resultGeoJson.features.length === 0) {
      return;
    }

    const resultFeatures: Array<FeatureData> = [];
    resultGeoJson.features
      .filter((feature) => !isGeoJsonFeatureInPolygon(feature, bufferedCutGeoJson))
      .forEach((feature) => {
        const lineFeatureData = this.createLineFeature(turfClone(feature));
        if (lineFeatureData) {
          resultFeatures.push(lineFeatureData);
        }
      });
    this.gm.features.delete(featureData);

    if (!isNonEmptyArray(resultFeatures)) {
      log.error('cutLineFeatureByPolygon: resultFeatures not found', resultGeoJson);
      return;
    }

    this.fireFeatureUpdatedEvent({
      sourceFeatures: [featureData],
      targetFeatures: resultFeatures,
    });
  }

  createLineFeature(lineFeatureGeoJson: Feature<LineString>) {
    const shapeGeoJson: GeoJsonShapeFeature = {
      ...lineFeatureGeoJson,
      properties: {
        shape: 'line',
      },
    };

    return this.gm.features.createFeature({
      shapeGeoJson,
      sourceName: SOURCES.main,
    });
  }

  cutPolygonFeatureByPolygon(featureId: FeatureId, cutGeoJson: PolygonFeature) {
    const featureData = this.gm.features.get(SOURCES.main, featureId);

    if (!featureData) {
      log.warn('cutPolygonFeatureByPolygon: featureData not found', featureId);
      return;
    }

    featureData.convertToPolygon(); // if possible
    const shapeGeoJson = featureData.getGeoJson() as PolygonFeature;
    const geoJsonDifference = this.getGeoJsonDifference(shapeGeoJson, cutGeoJson);
    if (geoJsonDifference) {
      featureData.updateGeoJsonGeometry(geoJsonDifference.geometry);
      this.fireFeatureUpdatedEvent({
        sourceFeatures: [featureData],
        targetFeatures: [featureData],
      });
    }
    log.debug('props', JSON.stringify(featureData.getGeoJson().properties, null, 2));
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
