import {
  type EditModeName,
  getLngLatDiff,
  type GmSystemEvent,
  type MapHandlerReturnData,
  SOURCES,
} from '@/main.ts';
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

  handleGmEdit(event: GmSystemEvent): MapHandlerReturnData {
    if (!isGmEditEvent(event)) {
      log.error('EditDrag.handleGmEdit: not an edit event', event);
      return { next: true };
    }

    if (event.action === 'marker_move' && event.lngLatStart && event.lngLatEnd) {
      const lngLatDiff = getLngLatDiff(event.lngLatStart, event.lngLatEnd);

      event.linkedFeatures.map((featureData) => {
        this.moveFeature(featureData, lngLatDiff);
      });

      const isUpdated = this.moveFeature(event.featureData, lngLatDiff);

      if (isUpdated) {
        this.previousLngLat = event.lngLatEnd;
      }
      return { next: false };
    } else if (event.action === 'marker_captured') {
      [event.featureData, ...(event.linkedFeatures ?? [])].map((featureData) => {
        featureData.changeSource({ sourceName: SOURCES.temporary, atomic: true });
        this.fireFeatureEditStartEvent({ feature: featureData });
      });
      this.flags.actionInProgress = true;
      this.setCursorToPointer();
    } else if (event.action === 'marker_released') {
      this.previousLngLat = null;
      [event.featureData, ...(event.linkedFeatures ?? [])].map((featureData) => {
        featureData.changeSource({ sourceName: SOURCES.main, atomic: true });
        this.fireFeatureEditEndEvent({ feature: featureData });
      });
      this.flags.actionInProgress = false;
    }
    return { next: true };
  }
}
