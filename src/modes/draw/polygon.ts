import { gmPrefix } from '@/core/events/listeners/base.ts';
import { SOURCES } from '@/core/features/index.ts';
import type { AnyEvent, DrawModeName, LineEventHandlerArguments, ShapeName } from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { LineDrawer } from '@/utils/draw/line-drawer.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import turfClone from '@turf/clone';
import combine from '@turf/combine';
import lineToPolygon from '@turf/line-to-polygon';
import unkinkPolygon from '@turf/unkink-polygon';
import type { Feature, MultiPolygon, Polygon } from 'geojson';


export class DrawPolygon extends BaseDraw {
  mode: DrawModeName = 'polygon';
  shape: ShapeName = 'polygon';
  lineDrawer = new LineDrawer(
    this.gm,
    { snappingMarkers: 'first', targetShape: 'polygon' },
  );
  mapEventHandlers = {
    [`${gmPrefix}:draw`]: this.forwardLineDrawerEvent.bind(this),
    mousemove: this.onMouseMove.bind(this),
  };

  onEndAction(): void {
    this.lineDrawer.endAction();
  }

  onStartAction(): void {
    this.lineDrawer.startAction();
    this.lineDrawer.on(
      'firstMarkerClick',
      this.polygonFinished.bind(this),
    );
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
          ...geoJsonPolygon.properties,
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
