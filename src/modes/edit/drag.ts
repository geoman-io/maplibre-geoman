import { type EditModeName, type GmSystemEvent, SOURCES } from '@/main.ts';
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

  async handleGmEdit(event: GmSystemEvent) {
    if (!isGmEditEvent(event)) {
      log.error('EditDrag.handleGmEdit: not an edit event', event);
      return { next: true };
    }

    if (event.action === 'marker_move' && event.lngLatStart && event.lngLatEnd) {
      if (!this.previousLngLat) {
        this.previousLngLat = event.lngLatStart;
      }
      await this.moveFeature(event.featureData, event.lngLatEnd);
      return { next: false };
    } else if (event.action === 'marker_captured') {
      await event.featureData.changeSource({ sourceName: SOURCES.temporary });
      this.flags.actionInProgress = true;
      await this.fireFeatureEditStartEvent({ feature: event.featureData });
      this.setCursorToPointer();
    } else if (event.action === 'marker_released') {
      this.previousLngLat = null;
      await event.featureData.changeSource({ sourceName: SOURCES.main });
      await this.fireFeatureEditEndEvent({ feature: event.featureData });
      this.flags.actionInProgress = false;
    }
    return { next: true };
  }
}
