import {
  type ActionType,
  type ControlOptions,
  type GenericSystemControl,
  type Geoman,
  type GmControlSwitchEvent,
  type GmDrawModeEvent,
  type GmEditModeEvent,
  type GmHelperModeEvent,
  type GmSystemEvent,
  isGmModeEvent,
  type ModeName,
} from '@/main.ts';
import { isGmControlEvent } from '@/utils/guards/events/index.ts';
import log from 'loglevel';

export abstract class BaseEventListener {
  gm: Geoman;

  protected constructor(gm: Geoman) {
    this.gm = gm;
  }

  async trackExclusiveModes(payload: GmSystemEvent) {
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

    await this.gm.control.eachControlWithOptions(async (item) => {
      const actionType = item.control.type;
      const targetMode = item.control.targetMode;

      if (actionType === currentSectionName && targetMode === currentModeName) {
        return;
      }

      if (item.controlOptions.active && item.control.settings.exclusive) {
        await this.gm.options.disableMode(actionType, targetMode);
      }
    });
  }

  async trackRelatedModes(payload: GmSystemEvent) {
    if (!isGmModeEvent(payload)) {
      return;
    }

    await this.gm.control.eachControlWithOptions(async (item) => {
      const control = item.control;
      const { type: actionType, targetMode: modeName } = control;

      if (control.settings.enabledBy?.includes(payload.mode)) {
        if (payload.action === 'mode_start') {
          if (this.gm.options.isModeEnabled(actionType, modeName)) {
            // disable a mode if it's enabled already
            // log.debug(`force disable ${actionType}:${modeName}`);
            await this.gm.options.disableMode(actionType, modeName);
          }
          await this.gm.options.enableMode(actionType, modeName);
        } else if (payload.action === 'mode_end') {
          await this.gm.options.disableMode(actionType, modeName);
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
      modeName = payload.mode;
    }

    return sectionName && modeName ? { sectionName, modeName } : null;
  }
}
