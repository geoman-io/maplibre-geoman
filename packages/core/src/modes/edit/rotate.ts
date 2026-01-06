import {
  type EditModeName,
  FeatureData,
  type FeatureShape,
  type GeoJsonShapeFeature,
  type GmEditEvent,
  type GmEditMarkerMoveEvent,
  type GmSystemEvent,
  type LngLatTuple,
  type ShapeName,
  SOURCES,
} from "@/main.ts";
import { BaseDrag } from "@/modes/edit/base-drag.ts";
import {
  geoJsonPointToLngLat,
  getGeoJsonCircle,
  getGeoJsonEllipse,
  getGeoJsonFirstPoint,
  getLngLatDiff,
  isEqualPosition,
} from "@/utils/geojson.ts";
import { isGmEditEvent } from "@/utils/guards/modes.ts";
import bearing from "@turf/bearing";
import centroid from "@turf/centroid";
import { featureCollection, point } from "@turf/helpers";
import transformRotate from "@turf/transform-rotate";
import type { Feature, Polygon } from "geojson";
import { cloneDeep } from "lodash-es";
import log from "loglevel";

type RotateShapeHandler = (
  featureData: FeatureData,
  shapeCentroid: LngLatTuple,
  event: GmEditMarkerMoveEvent,
) => GeoJsonShapeFeature | null;

export class EditRotate extends BaseDrag {
  mode: EditModeName = "rotate";
  allowedShapes: Array<ShapeName> = [
    "line",
    "rectangle",
    "polygon",
    "ellipse",
    "circle",
  ];
  convertFeaturesTypes: Array<FeatureShape> = ["rectangle"];

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
    this.bodyDragEnabled = this.getSettingValue("bodyDragEnabled") === true;
  }

  onEndAction(): void {
    // ...
  }

  async handleGmEdit(event: GmSystemEvent) {
    if (!isGmEditEvent(event)) {
      log.error("EditChange.handleGmEdit: not an edit event", event);
      return { next: false };
    }

    if (this.isFeatureAllowed(event)) {
      return { next: true };
    }

    if (
      event.action === "marker_move" &&
      event.lngLatStart &&
      event.lngLatEnd
    ) {
      if (event.markerData?.type === "vertex") {
        await this.moveVertex(event);
      } else {
        const lngLatDiff = getLngLatDiff(event.lngLatStart, event.lngLatEnd);
        this.moveSource(event.featureData, lngLatDiff);
      }
      return { next: false };
    } else if (event.action === "marker_captured") {
      this.gm.features.updateManager.beginTransaction("transactional-update");
      for (const fd of [event.featureData, ...(event.linkedFeatures ?? [])]) {
        await fd.changeSource({ sourceName: SOURCES.temporary });
        await this.fireFeatureEditStartEvent({ feature: fd });
      }
      this.gm.features.updateManager.commitTransaction();
      this.setCursorToPointer();
      this.flags.actionInProgress = true;
    } else if (event.action === "marker_released") {
      this.flags.actionInProgress = false;
      this.gm.features.updateManager.beginTransaction("transactional-update");
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
      "featureData" in event &&
      !this.allowedShapes.includes(event.featureData.shape as ShapeName)
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

    for (const fd of [event.featureData, ...(event.linkedFeatures ?? [])]) {
      const customRotateHandlerFunc =
        this.gm.options.settings.customRotateHandler;

      let updatedGeoJson: GeoJsonShapeFeature | null = null;

      if (customRotateHandlerFunc) {
        updatedGeoJson = customRotateHandlerFunc(fd, shapeCentroid, event);
      }

      if (!updatedGeoJson) {
        updatedGeoJson =
          this.shapeRotateHandlers[fd.shape]?.(fd, shapeCentroid, event) ||
          null;
      }

      if (updatedGeoJson) {
        await this.fireBeforeFeatureUpdate({
          features: [fd],
          geoJsonFeatures: [updatedGeoJson],
        });

        const isUpdated = await this.updateFeatureGeoJson({
          featureData: fd,
          featureGeoJson: updatedGeoJson,
        });

        if (isUpdated && this.convertFeaturesTypes.includes(fd.shape)) {
          await fd.convertToPolygon(); // if possible
        }
      } else {
        log.error(
          "EditRotate.moveVertex: invalid geojson",
          updatedGeoJson,
          event,
        );
      }
    }
  }

  rotateCircle(
    featureData: FeatureData,
    shapeCentroid: LngLatTuple,
    event: GmEditMarkerMoveEvent,
  ) {
    if (featureData.shape !== "circle") {
      log.error("EditRotate.rotateCircle: invalid shape type", featureData);
      return null;
    }

    const center = featureData.getShapeProperty("center");

    if (!Array.isArray(center)) {
      log.error("rotateCircle: missing center in the featureData", featureData);
      return null;
    }

    if (isEqualPosition(shapeCentroid, center)) {
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
      log.error("rotateCircle: missing center circleRimLngLat");
      return null;
    }

    const rotatedCenter = transformRotate(point(center), deltaAngle, {
      pivot: shapeCentroid,
    }).geometry.coordinates as LngLatTuple;
    const radius = this.gm.mapAdapter.getDistance(center, circleRimLngLat);

    return getGeoJsonCircle({
      center: rotatedCenter,
      radius,
    }) as GeoJsonShapeFeature;
  }

  rotateEllipse(
    featureData: FeatureData,
    shapeCentroid: LngLatTuple,
    event: GmEditMarkerMoveEvent,
  ) {
    if (featureData.shape !== "ellipse") {
      log.error("EditRotate.rotateEllipse: invalid shape type", featureData);
      return null;
    }

    const center = featureData.getShapeProperty("center");
    const xSemiAxis = featureData.getShapeProperty("xSemiAxis");
    const ySemiAxis = featureData.getShapeProperty("ySemiAxis");
    const angle = featureData.getShapeProperty("angle");

    if (
      !Array.isArray(center) ||
      typeof xSemiAxis !== "number" ||
      typeof ySemiAxis !== "number" ||
      typeof angle !== "number"
    ) {
      log.error(
        "rotateEllipse: missing center, xSemiAxis, ySemiAxis or angle in the featureData",
        featureData,
      );
      return null;
    }

    const deltaAngle = this.calculateRotationAngle(
      shapeCentroid,
      event.lngLatStart,
      event.lngLatEnd,
      false,
    );

    const rotatedCenter = transformRotate(point(center), deltaAngle, {
      pivot: shapeCentroid,
    }).geometry.coordinates as LngLatTuple;

    return getGeoJsonEllipse({
      center: rotatedCenter,
      xSemiAxis,
      ySemiAxis,
      angle: angle + deltaAngle,
    });
  }

  rotateFeature(
    featureData: FeatureData,
    shapeCentroid: LngLatTuple,
    event: GmEditMarkerMoveEvent,
  ) {
    const geoJson = cloneDeep(featureData.getGeoJson() as GeoJsonShapeFeature);

    const angle = this.calculateRotationAngle(
      shapeCentroid,
      event.lngLatStart,
      event.lngLatEnd,
    );

    geoJson.geometry = transformRotate(geoJson, angle, {
      pivot: shapeCentroid,
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
}
