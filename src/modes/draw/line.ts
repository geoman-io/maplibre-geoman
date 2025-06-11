import { gmPrefix } from '@/core/events/listeners/base.ts';
import { SOURCES } from '@/core/features/index.ts';
import type { AnyEvent, DrawModeName, GeoJsonShapeFeature, LineEventHandlerArguments, ShapeName } from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { LineDrawer } from '@/utils/draw/line-drawer.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { Position } from 'geojson';


export class DrawLine extends BaseDraw {
  mode: DrawModeName = 'line';
  shape: ShapeName = 'line';
  lineDrawer = new LineDrawer(
    this.gm,
    { snappingMarkers: 'first', targetShape: 'line' },
  );
  mapEventHandlers = {
    [`${gmPrefix}:draw`]: this.forwardLineDrawerEvent.bind(this),
    mousemove: this.onMouseMove.bind(this),
  };

  onStartAction(): void {
    this.lineDrawer.startAction();
    this.lineDrawer.on('nMarkerClick', this.lineFinished.bind(this));
  }

  onEndAction(): void {
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

  lineFinished(event: LineEventHandlerArguments) {
    this.lineDrawer.endShape();

    let shapeCoordinates = event.shapeCoordinates;
    if (event.markerIndex > 0) {
      // cut the shape coordinates to the marker index
      shapeCoordinates = shapeCoordinates.slice(0, event.markerIndex + 1);
    }

    if (shapeCoordinates.length < 2) {
      // lines with less than 2 points are discarded
      return null;
    }

    return this.gm.features.createFeature({
      shapeGeoJson: this.getFeatureGeoJson(shapeCoordinates),
      sourceName: SOURCES.main,
    });
  }

  getFeatureGeoJson(shapeCoordinates: Array<Position>): GeoJsonShapeFeature {
    return {
      type: 'Feature',
      properties: {
        shape: this.shape,
      },
      geometry: {
        type: 'LineString',
        coordinates: shapeCoordinates,
      },
    };
  }
}
