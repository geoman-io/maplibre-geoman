import type {
  ActionType,
  ControlOptions,
  GenericSystemControl,
  Geoman,
  GMControlSwitchEvent,
  GMDrawModeEvent,
  GMEditModeEvent,
  GMEvent,
  GMHelperModeEvent,
  ModeName,
} from '@/main.ts';
import { isGmControlEvent, isGmModeEvent } from '@/utils/guards/events/index.ts';
import log from 'loglevel';


export abstract class BaseEventListener {
  gm: Geoman;

  protected constructor(gm: Geoman) {
    this.gm = gm;
  }

  trackExclusiveModes(payload: GMEvent) {
    // if an exclusive mode is started, turn off all other exclusive modes
    if (payload.action !== 'mode_start') {
      return;
    }

    const {
      sectionName: currentSectionName,
      modeName: currentModeName,
    } = this.getControlIds(payload) || {};

    const control = this.getControl(payload);
    if (!control?.settings.exclusive) {
      return;
    }

    this.gm.control.eachControlWithOptions((item) => {
      const actionType = item.control.type;
      const targetMode = item.control.targetMode;

      if (actionType === currentSectionName && targetMode === currentModeName) {
        return;
      }

      if (item.controlOptions.active && item.control.settings.exclusive) {
        this.gm.options.disableMode(actionType, targetMode);
      }
    });
  }

  trackRelatedModes(payload: GMEvent) {
    if (!isGmModeEvent(payload)) {
      return;
    }

    this.gm.control.eachControlWithOptions((item) => {
      const control = item.control;

      if (control.settings.enabledBy?.includes(payload.mode)) {
        if (payload.action === 'mode_start') {
          this.gm.options.enableMode(control.type, control.targetMode);
        } else if (payload.action === 'mode_end') {
          this.gm.options.disableMode(control.type, control.targetMode);
        } else {
          log.error('Unknown mode action', payload.action);
        }
      }
    });
  }

  getControl(
    payload: GMDrawModeEvent | GMEditModeEvent | GMHelperModeEvent | GMControlSwitchEvent,
  ): GenericSystemControl | null {
    const { modeName, sectionName } = this.getControlIds(payload) || {};

    if (modeName && sectionName) {
      return this.gm.control.getControl({ actionType: sectionName, modeName });
    }

    return null;
  }

  getControlOptions(
    payload: GMDrawModeEvent | GMEditModeEvent | GMHelperModeEvent | GMControlSwitchEvent,
  ): ControlOptions | null {
    const { modeName, sectionName } = this.getControlIds(payload) || {};

    if (modeName && sectionName) {
      return this.gm.options.getControlOptions({ actionType: sectionName, modeName });
    }

    return null;
  }

  getControlIds(
    payload: GMDrawModeEvent | GMEditModeEvent | GMHelperModeEvent | GMControlSwitchEvent,
  ) {
    let sectionName: ActionType | null = null;
    let modeName: ModeName | null = null;

    if (payload.action === 'mode_start') {
      sectionName = payload.type;
      modeName = payload.mode;
    } else if (isGmControlEvent(payload)) {
      sectionName = payload.section;
      modeName = payload.target;
    }

    return sectionName && modeName ? { sectionName, modeName } : null;
  }
}
