import { type EditModeName, type FeatureShape, SHAPE_NAMES } from '@/main.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';

import { SOURCES } from '@/core/features/constants.ts';
import type { BaseMapEvent } from '@mapLib/types/events.ts';

export class EditDelete extends BaseEdit {
  mode: EditModeName = 'delete';
  allowedShapes: Array<FeatureShape> = [...SHAPE_NAMES];
  eventHandlers = {
    click: this.onMouseClick.bind(this),
  };

  onStartAction() {
    this.gm.markerPointer.enable({ invisibleMarker: true });
    this.gm.markerPointer.pauseSnapping();
  }

  onEndAction() {
    this.gm.markerPointer.resumeSnapping();
    this.gm.markerPointer.disable();
  }

  async onMouseClick(event: BaseMapEvent) {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: false };
    }

    const principalFeature = this.getFeatureByMouseEvent({ event, sourceNames: [SOURCES.main] });
    if (principalFeature && this.allowedShapes.includes(principalFeature.shape)) {
      if (!this.gm.features.selection.has(principalFeature.id)) {
        this.gm.features.setSelection([principalFeature.id]);
      }

      const linkedFeatures = this.gm.features.getLinkedFeatures(principalFeature);

      if (linkedFeatures.some((f) => f.getShapeProperty('disableEdit') === true)) {
        return { next: false };
      }

      this.gm.features.setSelection([], true);

      for (const fd of [principalFeature, ...linkedFeatures]) {
        await this.gm.features.delete(fd);
        await this.fireFeatureRemovedEvent(fd);
      }
    }
    return { next: false };
  }
}
