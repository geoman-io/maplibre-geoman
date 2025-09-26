import type {
  ActionType,
  ControlOptions,
  GenericSystemControl,
  Geoman,
  GmControlSwitchEvent,
  GmDrawModeEvent,
  GmEditModeEvent,
  GmSystemEvent,
  GmHelperModeEvent,
  ModeName,
} from '@/main.ts';
import { isGmControlEvent, isGmModeEvent } from '@/utils/guards/events/index.ts';
import log from 'loglevel';

export abstract class BaseEventListener {
  gm: Geoman;

  protected constructor(gm: Geoman) {
    this.gm = gm;
  }

  trackExclusiveModes(payload: GmSystemEvent) {
    // if an exclusive mode is started, turn off all other exclusive modes
    if (payload.action !== 'mode_start') {
      return;
    }

    const { sectionName: currentSectionName, modeName: currentModeName } =
      this.getControlIds(payload) || {};

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

  trackRelatedModes(payload: GmSystemEvent) {
    if (!isGmModeEvent(payload)) {
      return;
    }

    this.gm.control.eachControlWithOptions((item) => {
      const control = item.control;
      const { type: actionType, targetMode: modeName } = control;

      if (control.settings.enabledBy?.includes(payload.mode)) {
        if (payload.action === 'mode_start') {
          if (this.gm.options.isModeEnabled(actionType, modeName)) {
            // disable a mode if it's enabled already
            // log.debug(`force disable ${actionType}:${modeName}`);
            this.gm.options.disableMode(actionType, modeName);
          }
          this.gm.options.enableMode(actionType, modeName);
        } else if (payload.action === 'mode_end') {
          this.gm.options.disableMode(actionType, modeName);
        } else {
          log.error('Unknown mode action', payload.action);
        }
      }
    });
  }

  getControl(
    payload: GmDrawModeEvent | GmEditModeEvent | GmHelperModeEvent | GmControlSwitchEvent,
  ): GenericSystemControl | null {
    const { modeName, sectionName } = this.getControlIds(payload) || {};

    if (modeName && sectionName) {
      return this.gm.control.getControl({ modeType: sectionName, modeName });
    }

    return null;
  }

  getControlOptions(
    payload: GmDrawModeEvent | GmEditModeEvent | GmHelperModeEvent | GmControlSwitchEvent,
  ): ControlOptions | null {
    const { modeName, sectionName } = this.getControlIds(payload) || {};

    if (modeName && sectionName) {
      return this.gm.options.getControlOptions({ modeType: sectionName, modeName });
    }

    return null;
  }

  getControlIds(
    payload: GmDrawModeEvent | GmEditModeEvent | GmHelperModeEvent | GmControlSwitchEvent,
  ) {
    let sectionName: ActionType | null = null;
    let modeName: ModeName | null = null;

    if (payload.action === 'mode_start') {
      sectionName = payload.actionType;
      modeName = payload.mode;
    } else if (isGmControlEvent(payload)) {
      sectionName = payload.section;
      modeName = payload.target;
    }

    return sectionName && modeName ? { sectionName, modeName } : null;
  }
}
