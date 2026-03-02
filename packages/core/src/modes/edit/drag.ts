import { type EditModeName, getLngLatDiff, type GmSystemEvent, SOURCES } from '@/main.ts';
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
      const lngLatDiff = getLngLatDiff(event.lngLatStart, event.lngLatEnd);

      for (const fd of event.linkedFeatures ?? []) {
        await this.moveFeature(fd, lngLatDiff);
      }

      const isUpdated = await this.moveFeature(event.featureData, lngLatDiff);

      if (isUpdated) {
        this.previousLngLat = event.lngLatEnd;
      }
      return { next: false };
    } else if (event.action === 'marker_captured') {
      this.gm.features.updateManager.beginTransaction('transactional-update');
      for (const fd of [event.featureData, ...(event.linkedFeatures ?? [])]) {
        await fd.changeSource({ sourceName: SOURCES.temporary });
        await this.fireFeatureEditStartEvent({ feature: fd });
      }
      this.gm.features.updateManager.commitTransaction();
      this.flags.actionInProgress = true;
      this.setCursorToPointer();
    } else if (event.action === 'marker_released') {
      this.previousLngLat = null;
      this.gm.features.updateManager.beginTransaction('transactional-update');
      for (const fd of [event.featureData, ...(event.linkedFeatures ?? [])]) {
        await fd.changeSource({ sourceName: SOURCES.main });
        await this.fireFeatureEditEndEvent({ feature: fd });
      }
      this.gm.features.updateManager.commitTransaction();
      this.flags.actionInProgress = false;
    }
    return { next: true };
  }
}
