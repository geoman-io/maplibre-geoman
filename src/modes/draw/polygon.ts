import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import {
  type DrawModeName,
  type LineEventHandlerArguments,
  type ShapeName,
  SOURCES,
} from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { LineDrawer } from '@/utils/draw/line-drawer.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';
import turfClone from '@turf/clone';
import combine from '@turf/combine';
import lineToPolygon from '@turf/line-to-polygon';
import unkinkPolygon from '@turf/unkink-polygon';
import type { Feature, MultiPolygon, Polygon } from 'geojson';

export class DrawPolygon extends BaseDraw {
  mode: DrawModeName = 'polygon';
  shape: ShapeName = 'polygon';
  lineDrawer = new LineDrawer(this.gm, { snappingMarkers: 'first', targetShape: 'polygon' });
  eventHandlers = {
    [`${GM_SYSTEM_PREFIX}:draw`]: this.forwardLineDrawerEvent.bind(this),
    mousemove: this.onMouseMove.bind(this),
  };

  onEndAction(): void {
    this.lineDrawer.endAction();
  }

  onStartAction(): void {
    this.lineDrawer.startAction();
    this.lineDrawer.on('firstMarkerClick', this.polygonFinished.bind(this));
    this.lineDrawer.on('lastMarkerClick', this.polygonFinished.bind(this));
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

  polygonFinished(event: LineEventHandlerArguments) {
    this.lineDrawer.endShape();

    if (event.shapeCoordinates.length < 3) {
      // polygons with less than 3 points are discarded
      return;
    }

    const geoJsonPolygon = this.fixShapeGeoJson(lineToPolygon(event.geoJson));
    if (!geoJsonPolygon) {
      return;
    }

    this.gm.features.createFeature({
      shapeGeoJson: {
        ...geoJsonPolygon,
        properties: {
          // we don't need to have collected properties for a new polygon
          // ...geoJsonPolygon.properties,
          shape: this.shape,
        },
      },
      sourceName: SOURCES.main,
    });
  }

  fixShapeGeoJson(geoJsonPolygon: Feature<Polygon | MultiPolygon>) {
    try {
      const geoJson = turfClone(combine(unkinkPolygon(geoJsonPolygon)));
      return geoJson.features[0] as Feature<Polygon | MultiPolygon>;
    } catch {
      return null;
    }
  }
}
