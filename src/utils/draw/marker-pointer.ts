import { BaseDomMarker } from '@/core/map/base/marker.ts';
import type { AnyEvent, EventHandlers, Geoman, LngLat, MapEventHadler, ScreenPoint } from '@/main.ts';
import { SnappingHelper } from '@/modes/helpers/snapping.ts';
import { convertToThrottled, isTouchScreen } from '@/utils/behavior.ts';
import { createMarkerElement } from '@/utils/dom.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import log from 'loglevel';


type EnableMarkerParameters = {
  lngLat?: LngLat,
  customMarker?: BaseDomMarker,
  invisibleMarker?: boolean,
};


export class MarkerPointer {
  gm: Geoman;
  marker: BaseDomMarker | null = null;
  tmpMarker: BaseDomMarker | null = null;
  declare throttledMethods: { onMouseMove: MapEventHadler, };
  declare eventHandlers: EventHandlers;
  private snapping: boolean = false;
  private oldSnapping: boolean | undefined = undefined;

  constructor(gm: Geoman) {
    this.gm = gm;
    this.initEventHandlers();
  }

  get snappingHelper(): SnappingHelper | null {
    return (
      this.gm.actionInstances.helper__snapping || null
    ) as SnappingHelper | null;
  }

  initEventHandlers() {
    this.throttledMethods = convertToThrottled({
      onMouseMove: this.onMouseMove,
    }, this, this.gm.options.settings.throttlingDelay);

    this.eventHandlers = {
      mousemove: this.throttledMethods.onMouseMove.bind(this),
    };
  }

  setSnapping(snapping: boolean) {
    if (snapping && !this.snappingHelper) {
      log.error('MarkerPointer: snapping is not available');
      return;
    }

    this.snapping = snapping;
  }

  pauseSnapping() {
    if (this.oldSnapping !== undefined) {
      log.error('MarkerPointer: snapping is already paused');
    }
    this.oldSnapping = this.snapping;
    this.setSnapping(false);
  }

  resumeSnapping() {
    if (this.oldSnapping === undefined) {
      log.error('MarkerPointer: resumeSnapping is called before pauseSnapping');
      this.setSnapping(true);
    } else {
      this.setSnapping(this.oldSnapping);
      this.oldSnapping = undefined;
    }
  }

  enable({ lngLat, customMarker, invisibleMarker }: EnableMarkerParameters = {
    lngLat: [0, 0],
    customMarker: undefined,
    invisibleMarker: false,
  }) {
    if (isTouchScreen()) {
      // marker pointer is not available on touch screens
      return;
    }

    if (customMarker && invisibleMarker) {
      throw new Error('MarkerPointer: customMarker and invisibleMarker can\'t be used together');
    }
    if (this.marker) {
      throw new Error('MarkerPointer: marker is already enabled');
    }

    this.gm.events.bus.attachEvents(this.eventHandlers);
    if (invisibleMarker) {
      this.marker = this.createInvisibleMarker(lngLat || [0, 0]);
    } else {
      this.marker = customMarker || this.createMarker(lngLat || [0, 0]);
    }

    if (this.gm.getActiveDrawModes().length) {
      this.gm.mapAdapter.setCursor('crosshair');
    } else {
      // this.gm.setMapCursor('pointer');
    }
  }

  disable() {
    if (this.marker) {
      this.gm.events.bus.detachEvents(this.eventHandlers);
      this.marker.remove();
      this.marker = null;
    }
    this.gm.mapAdapter.setCursor('');
  }

  createMarker(lngLat: LngLat = [0, 0]): BaseDomMarker {
    return this.gm.mapAdapter.createDomMarker({
      anchor: 'center',
      element: createMarkerElement('dom', { pointerEvents: 'none' }),
    }, lngLat) as BaseDomMarker; // todo: create a marker abstraction
  }

  createInvisibleMarker(lngLat: LngLat = [0, 0]): BaseDomMarker {
    const htmlElement = document.createElement('div');
    htmlElement.style.width = '0px';
    htmlElement.style.height = '0px';

    return this.gm.mapAdapter.createDomMarker({
      anchor: 'center',
      element: htmlElement,
    }, lngLat) as BaseDomMarker; // todo: create a marker abstraction
  }

  onMouseMove(event: AnyEvent) {
    if (isMapPointerEvent(event, { warning: true }) && this.marker) {
      if (this.snapping && this.snappingHelper) {
        const point: ScreenPoint = [event.point.x, event.point.y];
        const snappedLngLat = this.snappingHelper.getSnappedLngLat(event.lngLat.toArray(), point);
        this.marker.setLngLat(snappedLngLat);
      } else {
        this.marker.setLngLat(event.lngLat.toArray());
      }
    }
    return { next: true };
  }

  syncTmpMarker(lngLat: LngLat) {
    if (!this.tmpMarker) {
      this.tmpMarker = this.createMarker(lngLat);
    }
    this.tmpMarker.setLngLat(lngLat);
  }
}
