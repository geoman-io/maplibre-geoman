import { GM_PREFIX, GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { SOURCES } from '@/core/features/constants.ts';
import type { DrawModeName, ShapeName } from '@/types/modes/index.ts';
import type { LineEventHandlerArguments } from '@/types/modes/line-drawer.ts';
import type { AnyEventName } from '@/types/map/index.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { LineDrawer } from '@/utils/draw/line-drawer.ts';
import { preparePolygonFinish, type PolygonFinishRejection } from '@/utils/polygon-finish.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';

export class DrawPolygon extends BaseDraw {
  mode: DrawModeName = 'polygon';
  shape: ShapeName = 'polygon';
  lineDrawer = new LineDrawer(this.gm, { snappingMarkers: 'first', targetShape: 'polygon' });
  eventHandlers = {
    [`${GM_SYSTEM_PREFIX}:draw`]: this.forwardLineDrawerEvent.bind(this),
    mousemove: this.onMouseMove.bind(this),
  };

  async onEndAction() {
    await this.lineDrawer.endAction();
  }

  async onStartAction() {
    await this.lineDrawer.startAction();
    this.lineDrawer.on('firstMarkerClick', this.polygonFinished.bind(this));
    this.lineDrawer.on('lastMarkerClick', this.polygonFinished.bind(this));
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

  async polygonFinished(event: LineEventHandlerArguments) {
    const prepared = preparePolygonFinish(event.shapeCoordinates, {
      selfIntersection: this.gm.options.settings.polygonSelfIntersection ?? 'split',
      asPolygon: this.gm.options.settings.polygonAsPolygon ?? false,
    });
    if (!prepared.ok) {
      await this.firePolygonRejected(prepared.reason);
      return;
    }

    const shapeGeoJson = {
      ...prepared.feature,
      properties: {
        shape: this.shape,
      },
    };

    // The closed ring is checked here so the first vertex, the last vertex and
    // Enter (Pro) all go through the same before-create veto (#257).
    await this.fireBeforeFeatureCreate({ geoJsonFeatures: [shapeGeoJson] });
    if (!this.flags.featureCreateAllowed) {
      await this.firePolygonRejected('creation_rejected');
      return;
    }

    await this.lineDrawer.endShape();
    await this.gm.features.createFeature({
      shapeGeoJson,
      sourceName: SOURCES.main,
    });
  }

  async firePolygonRejected(reason: PolygonFinishRejection | 'creation_rejected') {
    const payload = {
      name: `${GM_PREFIX}:draw:rejected` as const,
      actionType: 'draw' as const,
      mode: this.mode,
      action: 'rejected' as const,
      reason,
      shape: this.shape,
    };
    this.gm.mapAdapter.fire(`${GM_PREFIX}:draw:rejected` as AnyEventName, payload);
    this.gm.events.bus.forwarder.globalEventsListener?.(payload as never);
  }
}
