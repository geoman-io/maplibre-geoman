import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { FeatureData } from '@/core/features/feature-data.ts';
import {
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
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import booleanIntersects from '@turf/boolean-intersects';
import turfClone from '@turf/clone';
import turfDifference from '@turf/difference';
import { featureCollection, lineString } from '@turf/helpers';
import lineSplit from '@turf/line-split';
import lineToPolygon from '@turf/line-to-polygon';
import type { Feature, LineString, MultiLineString, MultiPolygon, Polygon } from 'geojson';
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

  onStartAction() {
    this.lineDrawer.startAction();
    this.lineDrawer.on('firstMarkerClick', this.cutPolygonFinished.bind(this));
  }

  onEndAction() {
    this.lineDrawer.endAction();
  }

  onMouseMove(event: BaseMapEvent) {
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
      if (featureData.getShapeProperty('disableEdit') === true) {
        return;
      }
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
    const { geometry } = featureData.getGeoJson() as Feature<LineString | MultiLineString>;
    const bufferedCutGeoJson = getBufferedOuterPolygon(this.gm.mapAdapter, cutGeoJson);

    if (!bufferedCutGeoJson) {
      return;
    }

    if (geometry.type === 'MultiLineString') {
      const newGeometry: MultiLineString = {
        type: 'MultiLineString',
        coordinates: [],
      };
      let isCut = false;

      geometry.coordinates.forEach((lineCoordinates) => {
        const resultGeoJson = lineSplit(lineString(lineCoordinates), cutGeoJson);

        if (resultGeoJson.features.length === 0) {
          newGeometry.coordinates.push(lineCoordinates);
          return;
        }

        resultGeoJson.features
          .filter((feature) => !isGeoJsonFeatureInPolygon(feature, bufferedCutGeoJson))
          .forEach((feature) => {
            isCut = true;
            newGeometry.coordinates.push(feature.geometry.coordinates);
          });
      });

      if (isCut) {
        featureData.updateGeoJsonGeometry(newGeometry);
        this.fireFeatureUpdatedEvent({
          sourceFeatures: [featureData],
          targetFeatures: [featureData],
        });
      }
    } else if (geometry.type === 'LineString') {
      const resultGeoJson = lineSplit(geometry, cutGeoJson);

      if (resultGeoJson.features.length === 0) {
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
