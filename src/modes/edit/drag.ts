import { type AnyEvent, type EditModeName, type MapHandlerReturnData, SOURCES } from '@/main.ts';
import { BaseDrag } from '@/modes/edit/base-drag.ts';
import { isGmEditEvent } from '@/utils/guards/modes.ts';
import log from 'loglevel';

export class EditDrag extends BaseDrag {
  mode: EditModeName = 'drag';

  onStartAction(): void {
    // ...
  }

  onEndAction(): void {
    // ...
  }

  handleGmEdit(event: AnyEvent): MapHandlerReturnData {
    if (!isGmEditEvent(event)) {
      log.error('EditDrag.handleGmEdit: not an edit event', event);
      return { next: true };
    }

    if (event.action === 'marker_move' && event.lngLatStart && event.lngLatEnd) {
      if (!this.previousLngLat) {
        this.previousLngLat = event.lngLatStart;
      }
      this.moveFeature(event.featureData, event.lngLatEnd);
      return { next: false };
    } else if (event.action === 'marker_captured') {
      this.isDragging = true;
      event.featureData.changeSource({ sourceName: SOURCES.temporary, atomic: true });
      this.fireFeatureEditStartEvent({ feature: event.featureData });
    } else if (event.action === 'marker_released') {
      this.previousLngLat = null;
      this.isDragging = false;
      event.featureData.changeSource({ sourceName: SOURCES.main, atomic: true });
      this.fireFeatureEditEndEvent({ feature: event.featureData });
    }
    return { next: true };
  }
}
