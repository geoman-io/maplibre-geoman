import { GM_PREFIX } from '@/core/constants.ts';
import { getDefaultOptions, trackDefaultUiEnabledState } from '@/core/options/defaults/index.ts';
import { mergeByTypeCustomizer } from '@/core/options/utils.ts';
import {
  type ActionType,
  type ControlOptions,
  DRAW_MODES,
  type GenericControlsOptions,
  type Geoman,
  type GmBaseModeEvent,
  type GmControlSwitchEvent,
  type GmOptionsData,
  type ModeAction,
  type ModeName,
  type ModeType,
} from '@/main.ts';
import { EDIT_MODES, HELPER_MODES } from '@/modes/constants.ts';
import { isGmModeEvent } from '@/utils/guards/events/index.ts';
import { isGmDrawEvent, isGmEditEvent, isGmHelperEvent } from '@/utils/guards/modes.ts';
import { includesWithType } from '@/utils/typing.ts';
import mergeWith from 'lodash-es/mergeWith';
import log from 'loglevel';
import type { PartialDeep } from 'type-fest';

export class GmOptions {
  gm: Geoman;

  settings: GmOptionsData['settings'];
  controls: GmOptionsData['controls'];
  layerStyles: GmOptionsData['layerStyles'];

  constructor(gm: Geoman, inputOptions: PartialDeep<GmOptionsData>) {
    this.gm = gm;
    const options = this.getMergedOptions(inputOptions);
    this.settings = options.settings;
    this.controls = options.controls;
    this.layerStyles = options.layerStyles;
  }

  getMergedOptions(options: PartialDeep<GmOptionsData> = {}): GmOptionsData {
    const defaultOptions = getDefaultOptions();

    if (typeof options.settings?.controlsUiEnabledByDefault === 'boolean') {
      defaultOptions.settings.controlsUiEnabledByDefault =
        options.settings.controlsUiEnabledByDefault;
    }

    trackDefaultUiEnabledState(defaultOptions);

    return mergeWith(defaultOptions, options, mergeByTypeCustomizer);
  }

  enableMode(modeType: ModeType, modeName: ModeName) {
    const isModeEnabled = this.isModeEnabled(modeType, modeName);
    const isModeAvailable = this.isModeAvailable(modeType, modeName);

    if (!isModeAvailable) {
      log.warn(`Unable to enable mode, "${modeType}:${modeName}" is not available`);
    }

    if (isModeEnabled || !isModeAvailable) {
      return;
    }

    const sectionOptions = this.controls[modeType] as GenericControlsOptions;
    const controlOptions = sectionOptions[modeName];
    if (controlOptions) {
      controlOptions.active = true;
      this.fireModeEvent(modeType, modeName, 'mode_start');
      this.fireControlEvent(modeType, modeName, 'on');
      this.fireModeEvent(modeType, modeName, 'mode_started');
    } else {
      log.error("Can't find control section for", modeType, modeName);
    }
  }

  disableMode(modeType: ModeType, modeName: ModeName) {
    const isModeEnabled = this.isModeEnabled(modeType, modeName);
    const isModeAvailable = this.isModeAvailable(modeType, modeName);

    if (!isModeEnabled || !isModeAvailable) {
      return;
    }

    const sectionOptions = this.controls[modeType] as GenericControlsOptions;
    const controlOptions = sectionOptions[modeName];
    if (controlOptions) {
      controlOptions.active = false;
      this.fireModeEvent(modeType, modeName, 'mode_end');
      this.fireControlEvent(modeType, modeName, 'off');
      this.fireModeEvent(modeType, modeName, 'mode_ended');
    } else {
      log.error("Can't find control section for", modeType, modeName);
    }
  }

  syncModeState(modeType: ModeType, modeName: ModeName) {
    // align options with current state
    // it' possible to have "active" mode in options
    // when it's not available (in free version for example)
    const sectionOptions = this.controls[modeType] as GenericControlsOptions;
    const controlOptions = sectionOptions[modeName];
    const isModeAvailable = this.isModeAvailable(modeType, modeName);

    if (controlOptions) {
      if (isModeAvailable) {
        if (controlOptions.active) {
          this.enableMode(modeType, modeName);
        } else {
          this.disableMode(modeType, modeName);
        }
      } else {
        console.log(`Not available mode: ${modeType}:${modeName}`);
        controlOptions.active = false;
        controlOptions.uiEnabled = false;
      }
    }
  }

  toggleMode(modeType: ModeType, modeName: ModeName) {
    if (this.isModeEnabled(modeType, modeName)) {
      this.disableMode(modeType, modeName);
    } else {
      this.enableMode(modeType, modeName);
    }
  }

  isModeEnabled(actionType: ActionType, modeName: ModeName) {
    return !!Object.entries(this.gm.actionInstances).find(([actionName, instance]) => {
      return actionName === `${actionType}__${modeName}` && instance;
    });
  }

  isModeAvailable(actionType: ActionType, modeName: ModeName): boolean {
    if (actionType === 'draw' && includesWithType(modeName, DRAW_MODES)) {
      return !!this.gm.drawClassMap[modeName];
    } else if (actionType === 'edit' && includesWithType(modeName, EDIT_MODES)) {
      return !!this.gm.editClassMap[modeName];
    } else if (actionType === 'helper' && includesWithType(modeName, HELPER_MODES)) {
      return !!this.gm.helperClassMap[modeName];
    }

    return false;
  }

  getControlOptions({
    modeType,
    modeName,
  }: {
    modeType: ModeType;
    modeName: ModeName;
  }): ControlOptions | null {
    if (modeType && modeName) {
      const sectionOptions = this.controls[modeType] as GenericControlsOptions;
      return sectionOptions[modeName] || null;
    }

    return null;
  }

  fireModeEvent(sectionName: ActionType, modeName: ModeName, action: ModeAction) {
    const payload: GmBaseModeEvent & { mode: ModeName } = {
      name: `${GM_PREFIX}:${modeName}:mode`,
      level: 'system',
      actionType: sectionName,
      mode: modeName,
      action,
    };

    if (isGmModeEvent(payload)) {
      if (isGmDrawEvent(payload)) {
        this.gm.events.fire(`${GM_PREFIX}:${sectionName}`, payload);
      } else if (isGmEditEvent(payload)) {
        this.gm.events.fire(`${GM_PREFIX}:${sectionName}`, payload);
      } else if (isGmHelperEvent(payload)) {
        this.gm.events.fire(`${GM_PREFIX}:${sectionName}`, payload);
      } else {
        log.warn('Unknown mode event: ', payload);
      }
    }
  }

  fireControlEvent(
    sectionName: ModeType,
    modeName: ModeName,
    action: GmControlSwitchEvent['action'],
  ) {
    const payload: GmControlSwitchEvent = {
      name: 'gm:control:switch',
      level: 'system',
      actionType: 'control',
      section: sectionName,
      target: modeName,
      action,
    };
    this.gm.events.fire(`${GM_PREFIX}:control`, payload);
  }
}
