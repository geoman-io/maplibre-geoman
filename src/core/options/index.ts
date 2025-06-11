import { gmPrefix } from '@/core/events/listeners/base.ts';
import { getDefaultOptions } from '@/core/options/defaults/index.ts';
import type {
  ActionType,
  ControlOptions,
  GenericControlsOptions,
  Geoman,
  GMControlSwitchEvent,
  GmOptionsData,
  ModeAction,
  ModeName,
} from '@/main.ts';
import { drawModes } from '@/modes/draw/base.ts';
import { editModes } from '@/modes/edit/base.ts';
import { helperModes } from '@/modes/helpers/base.ts';
import { isGmModeEvent } from '@/utils/guards/events/index.ts';
import { isGmDrawEvent, isGmEditEvent, isGmHelperEvent } from '@/utils/guards/modes.ts';
import { includesWithType } from '@/utils/typing.ts';
import mergeWith from 'lodash-es/mergeWith';
import log from 'loglevel';
import type { PartialDeep } from 'type-fest';
import { mergeByTypeCustomizer } from '@/core/options/utils.ts';


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
    return mergeWith(
      getDefaultOptions(),
      options,
      mergeByTypeCustomizer,
    );
  }

  enableMode(actionType: ActionType, modeName: ModeName) {
    const isModeEnabled = this.isModeEnabled(actionType, modeName);
    const isModeAvailable = this.isModeAvailable(actionType, modeName);

    if (!isModeAvailable) {
      log.warn(`Unable to enable mode, "${actionType}:${modeName}" is not available`);
    }

    if (isModeEnabled || !isModeAvailable) {
      return;
    }

    const sectionOptions = this.controls[actionType] as GenericControlsOptions;
    const controlOptions = sectionOptions[modeName];
    if (controlOptions) {
      controlOptions.active = true;
      this.fireModeEvent(actionType, modeName, 'mode_start');
      this.fireControlEvent(actionType, modeName, 'on');
      this.fireModeEvent(actionType, modeName, 'mode_started');
    } else {
      log.error('Can\'t find control section for', actionType, modeName);
    }
  }

  disableMode(actionType: ActionType, modeName: ModeName) {
    const isModeEnabled = this.isModeEnabled(actionType, modeName);
    const isModeAvailable = this.isModeAvailable(actionType, modeName);

    if (!isModeEnabled || !isModeAvailable) {
      return;
    }

    const sectionOptions = this.controls[actionType] as GenericControlsOptions;
    const controlOptions = sectionOptions[modeName];
    if (controlOptions) {
      controlOptions.active = false;
      this.fireModeEvent(actionType, modeName, 'mode_end');
      this.fireControlEvent(actionType, modeName, 'off');
      this.fireModeEvent(actionType, modeName, 'mode_ended');
    } else {
      log.error('Can\'t find control section for', actionType, modeName);
    }
  }

  syncModeState(actionType: ActionType, modeName: ModeName) {
    // align options with current state
    // it' possible to have "active" mode in options
    // when it's not available (in free version for example)
    const sectionOptions = this.controls[actionType] as GenericControlsOptions;
    const controlOptions = sectionOptions[modeName];
    const isModeAvailable = this.isModeAvailable(actionType, modeName);

    if (controlOptions) {
      if (isModeAvailable) {
        if (controlOptions.active) {
          this.enableMode(actionType, modeName);
        } else {
          this.disableMode(actionType, modeName);
        }
      } else {
        console.log(`Not available mode: ${actionType}:${modeName}`);
        controlOptions.active = false;
        controlOptions.uiEnabled = false;
      }
    }
  }

  toggleMode(actionType: ActionType, modeName: ModeName) {
    if (this.isModeEnabled(actionType, modeName)) {
      this.disableMode(actionType, modeName);
    } else {
      this.enableMode(actionType, modeName);
    }
  }

  isModeEnabled(actionType: ActionType, modeName: ModeName) {
    return !!Object.entries(this.gm.actionInstances).find(([actionName, instance]) => {
      return actionName === `${actionType}__${modeName}` && instance;
    });
  }

  isModeAvailable(actionType: ActionType, modeName: ModeName): boolean {
    if (actionType === 'draw' && includesWithType(modeName, drawModes)) {
      return !!this.gm.drawClassMap[modeName];
    } else if (actionType === 'edit' && includesWithType(modeName, editModes)) {
      return !!this.gm.editClassMap[modeName];
    } else if (actionType === 'helper' && includesWithType(modeName, helperModes)) {
      return !!this.gm.helperClassMap[modeName];
    }

    return false;
  }

  getControlOptions({ actionType, modeName }: {
    actionType: ActionType,
    modeName: ModeName,
  }): ControlOptions | null {
    if (actionType && modeName) {
      const sectionOptions = this.controls[actionType] as GenericControlsOptions;
      return sectionOptions[modeName] || null;
    }

    return null;
  }

  fireModeEvent(sectionName: ActionType, modeName: ModeName, action: ModeAction) {
    const payload = {
      level: 'system',
      type: sectionName,
      mode: modeName,
      action,
    };

    if (isGmModeEvent(payload)) {
      if (isGmDrawEvent(payload)) {
        this.gm.events.fire(`${gmPrefix}:${sectionName}`, payload);
      } else if (isGmEditEvent(payload)) {
        this.gm.events.fire(`${gmPrefix}:${sectionName}`, payload);
      } else if (isGmHelperEvent(payload)) {
        this.gm.events.fire(`${gmPrefix}:${sectionName}`, payload);
      }
    }
  }

  fireControlEvent(sectionName: ActionType, modeName: ModeName, action: GMControlSwitchEvent['action']) {
    const payload: GMControlSwitchEvent = {
      level: 'system',
      type: 'control',
      section: sectionName,
      target: modeName,
      action,
    };
    this.gm.events.fire(`${gmPrefix}:control`, payload);
  }
}
