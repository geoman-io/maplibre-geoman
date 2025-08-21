import { SOURCES } from '@/core/features/index.ts';
import { type AnyEvent, type EditModeName, type FeatureShape, type MapHandlerReturnData, shapeNames } from '@/main.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';

export class EditDelete extends BaseEdit {
  mode: EditModeName = 'delete';
  allowedShapes: Array<FeatureShape> = [...shapeNames];
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

  onMouseClick(event: AnyEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event, { warning: true })) {
      return { next: false };
    }

    const feature = this.gm.features.getFeatureByMouseEvent({ event, sourceNames: [SOURCES.main] });
    if (feature && this.allowedShapes.includes(feature.shape)) {
      this.gm.features.delete(feature);
      this.fireFeatureRemovedEvent(feature);
    }
    return { next: false };
  }
}
