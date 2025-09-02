import { FeatureData } from '@/core/features/feature-data.ts';
import type { FeatureShape, HelperModeName, LngLat, ScreenPoint } from '@/main.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';
import { eachCoordinateWithPath, getEuclideanDistance } from '@/utils/geojson.ts';
import type { Feature, LineString, MultiLineString } from 'geojson';
import { sortBy } from 'lodash-es';

import { SOURCES } from '@/core/features/constants.ts';

type ShapeSnappingHandler = (
  featureData: FeatureData,
  lngLat: LngLat,
  point: ScreenPoint,
) => { lngLat: LngLat; distance: number };

export class SnappingHelper extends BaseHelper {
  mode: HelperModeName = 'snapping';
  tolerance: number = 18;
  lineSnappingShapes: ReadonlyArray<FeatureShape> = [
    'circle',
    'line',
    'rectangle',
    'polygon',
    'snap_guide',
  ];
  eventHandlers = {};
  shapeSnappingHandlers: { [key in FeatureShape]?: ShapeSnappingHandler } = {
    marker: this.getPointsSnapping.bind(this),
    circle: this.getLineSnapping.bind(this),
    circle_marker: this.getPointsSnapping.bind(this),
    text_marker: this.getPointsSnapping.bind(this),
    line: this.getLineSnapping.bind(this),
    rectangle: this.getLineSnapping.bind(this),
    polygon: this.getLineSnapping.bind(this),
    snap_guide: this.getLineSnapping.bind(this),
  };
  private excludedFeature = new Set<FeatureData>();
  private customSnappingLngLats = new Map<string, Array<LngLat>>();
  private customSnappingFeatures = new Set<FeatureData>();

  onStartAction() {
    this.gm.markerPointer.setSnapping(true);
  }

  onEndAction() {
    this.gm.markerPointer.setSnapping(false);
  }

  addExcludedFeature(featureData: FeatureData) {
    this.excludedFeature.add(featureData);
  }

  clearExcludedFeatures() {
    this.excludedFeature.clear();
  }

  addCustomSnappingFeature(featureData: FeatureData) {
    this.customSnappingFeatures.add(featureData);
  }

  removeCustomSnappingFeature(featureData: FeatureData) {
    this.customSnappingFeatures.delete(featureData);
  }

  clearCustomSnappingFeature() {
    this.customSnappingFeatures.clear();
  }

  setCustomSnappingCoordinates(sectionKey: string, lngLats: Array<LngLat>) {
    this.customSnappingLngLats.set(sectionKey, lngLats);
  }

  clearCustomSnappingCoordinates(sectionKey: string) {
    this.customSnappingLngLats.delete(sectionKey);
  }

  getSnappedLngLat(lngLat: LngLat, point: ScreenPoint): LngLat {
    let snappingLngLat = this.getCustomLngLatsSnapping(point);
    if (snappingLngLat) {
      return snappingLngLat;
    }

    const features = this.getFeaturesInPointBounds(point).filter(
      (featureData) => !this.excludedFeature.has(featureData),
    );

    snappingLngLat = this.getFeaturePointsSnapping(features, lngLat, point);
    if (snappingLngLat) {
      return snappingLngLat;
    }

    snappingLngLat = this.getFeatureLinesSnapping(features, lngLat, point);
    if (snappingLngLat) {
      return snappingLngLat;
    }

    return lngLat;
  }

  getCustomLngLatsSnapping(point: ScreenPoint): LngLat | null {
    const closestPointData: { distance: number; lngLat: LngLat | null } = {
      distance: Infinity,
      lngLat: null,
    };

    this.customSnappingLngLats.forEach((coordinates) => {
      coordinates.forEach((customLngLat) => {
        const coordPoint = this.gm.mapAdapter.project(customLngLat);
        const distance = getEuclideanDistance(point, coordPoint);

        if (distance < this.tolerance && distance < closestPointData.distance) {
          closestPointData.distance = distance;
          closestPointData.lngLat = customLngLat;
        }
      });
    });

    return closestPointData.lngLat;
  }

  getFeaturePointsSnapping(features: Array<FeatureData>, lngLat: LngLat, point: ScreenPoint) {
    let featuresPointsSnapping = features
      .map((featureData) => ({
        shape: featureData.shape,
        ...this.getPointsSnapping(featureData, lngLat, point),
      }))
      .filter((item) => item.distance < this.tolerance);

    if (featuresPointsSnapping.length) {
      featuresPointsSnapping = sortBy(featuresPointsSnapping, ['distance']);
      return featuresPointsSnapping[0].lngLat;
    }
    return null;
  }

  getFeatureLinesSnapping(features: Array<FeatureData>, lngLat: LngLat, point: ScreenPoint) {
    type LineSpappingData = ReturnType<ShapeSnappingHandler> & { shape: FeatureShape };

    let featuresLineSnapping = features
      .filter((featureData) => this.lineSnappingShapes.includes(featureData.shape))
      .map((featureData) => {
        const snappingHandler = this.shapeSnappingHandlers[featureData.shape];
        if (snappingHandler) {
          return {
            shape: featureData.shape,
            ...snappingHandler(featureData, lngLat, point),
          };
        }
        return null;
      })
      .filter((item): item is LineSpappingData => item !== null && item.distance < this.tolerance);

    if (featuresLineSnapping.length) {
      featuresLineSnapping = sortBy(featuresLineSnapping, ['distance']);
      return featuresLineSnapping[0].lngLat;
    }

    return null;
  }

  getFeaturesInPointBounds(point: ScreenPoint): Array<FeatureData> {
    const bounds: [ScreenPoint, ScreenPoint] = [
      [point[0] - this.tolerance, point[1] - this.tolerance],
      [point[0] + this.tolerance, point[1] + this.tolerance],
    ];

    return (
      this.gm.features
        .getFeaturesByScreenBounds({ bounds, sourceNames: [SOURCES.main, SOURCES.temporary] })
        .filter((featureData) => {
          return featureData.temporary ? this.customSnappingFeatures.has(featureData) : true;
        }) || []
    );
  }

  getPointsSnapping(
    featureData: FeatureData,
    lngLat: LngLat,
    point: ScreenPoint,
  ): ReturnType<ShapeSnappingHandler> {
    const shapeGeoJson = featureData.getGeoJson();
    const closestPointData: { distance: number; coord: LngLat | null } = {
      distance: Infinity,
      coord: null, // lngLat coords
    };

    eachCoordinateWithPath(
      shapeGeoJson,
      (position) => {
        const coordPoint = this.gm.mapAdapter.project(position.coordinate);
        const distance = getEuclideanDistance(point, coordPoint);

        if (distance < this.tolerance && distance < closestPointData.distance) {
          closestPointData.distance = distance;
          closestPointData.coord = position.coordinate;
        }
      },
      true,
    );

    return {
      lngLat: closestPointData.coord ? closestPointData.coord : lngLat,
      distance: closestPointData.distance,
    };
  }

  getLineSnapping(
    featureData: FeatureData,
    lngLat: LngLat,
    point: ScreenPoint,
  ): ReturnType<ShapeSnappingHandler> {
    const shapeGeoJson = featureData.getGeoJson() as Feature<LineString>;
    return this.getNearestLinePointData(shapeGeoJson, lngLat, point);
  }

  getNearestLinePointData(
    lineGeoJson: Feature<LineString | MultiLineString>,
    lngLat: LngLat,
    point: ScreenPoint,
  ) {
    const result: ReturnType<ShapeSnappingHandler> = {
      lngLat,
      distance: Infinity,
    };

    const nearestPointLngLat = this.gm.mapAdapter.getEuclideanNearestLngLat(lineGeoJson, lngLat);

    const nearestPointCoord = this.gm.mapAdapter.project(nearestPointLngLat);

    result.distance = getEuclideanDistance(nearestPointCoord, point);
    if (result.distance < this.tolerance) {
      result.lngLat = nearestPointLngLat;
    }

    return result;
  }
}
