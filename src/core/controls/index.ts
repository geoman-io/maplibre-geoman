import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { controlsStore } from '@/core/controls/components/controls-store.ts';
import GmReactiveControls from '@/core/controls/components/gm-controls.svelte';
import { systemControls } from '@/core/controls/defaults.ts';
import { BaseControl } from '@/core/map/base/control.ts';
import {
  type BaseControlsPosition,
  type ControlOptions,
  type EventHandlers,
  type GenericSystemControl,
  type GenericSystemControls,
  type GmBaseModeEvent,
  isGmModeEvent,
  type ModeAction,
  type ModeName,
  type ModeType,
  type SystemControls,
} from '@/main.ts';
import { typedKeys } from '@/utils/typing.ts';
import { cloneDeep } from 'lodash-es';
import log from 'loglevel';
import { mount, unmount } from 'svelte';

export default class GMControl extends BaseControl {
  controls: SystemControls = cloneDeep(systemControls);
  reactiveControls: Record<string, unknown> | null = null;
  container: HTMLElement | undefined = undefined;
  eventHandlers: EventHandlers = {
    [`${GM_SYSTEM_PREFIX}:draw`]: this.handleModeEvent.bind(this),
    [`${GM_SYSTEM_PREFIX}:edit`]: this.handleModeEvent.bind(this),
    [`${GM_SYSTEM_PREFIX}:helper`]: this.handleModeEvent.bind(this),
  };

  onAdd(): HTMLElement {
    this.createControls();
    this.gm.events.bus.attachEvents(this.eventHandlers);

    if (!this.container) {
      // container must be created in .createControls()
      throw new Error('Controls container is not initialized');
    }
    return this.container;
  }

  createControls(containerElement: HTMLElement | undefined = undefined) {
    if (this.controlsAdded()) {
      log.warn("Can't add controls: controls already added");
      return;
    }

    this.container = containerElement || this.createHtmlContainer();
    this.createReactivePanel();
  }

  onRemove() {
    this.gm.events.bus.detachEvents(this.eventHandlers);

    // Destroy the Svelte component
    if (this.reactiveControls) {
      unmount(this.reactiveControls);
      this.reactiveControls = null;
    }

    // Remove the container from the DOM
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = undefined;
  }

  handleModeEvent(event: GmBaseModeEvent) {
    if (!isGmModeEvent(event)) {
      return { next: true };
    }

    const trackModes: Array<ModeAction> = ['mode_started', 'mode_ended'];

    if (trackModes.includes(event.action)) {
      this.updateReactivePanel();
    }

    return { next: true };
  }

  controlsAdded() {
    return !!this.reactiveControls;
  }

  createReactivePanel() {
    if (!this.container) {
      log.error("Can't create reactive panel: container is not initialized");
      return;
    }

    this.syncModeStates();

    const controlsContext = new Map();
    controlsContext.set('gm', this.gm);

    this.reactiveControls = mount(GmReactiveControls, {
      target: this.container,
      context: controlsContext,
    });

    this.updateReactivePanel();
  }

  updateReactivePanel() {
    controlsStore.update(() => ({
      controls: this.controls,
      options: this.gm.options.controls,
      settings: this.gm.options.settings,
    }));
  }

  createHtmlContainer() {
    const container = document.createElement('div');
    container.classList.add('geoman-controls');
    return container;
  }

  syncModeStates() {
    this.eachControlWithOptions(({ control }) => {
      this.gm.options.syncModeState(control.type, control.targetMode);
    });
  }

  eachControlWithOptions(
    callback: ({
      control,
    }: {
      control: GenericSystemControl;
      controlOptions: ControlOptions;
    }) => void,
  ) {
    return typedKeys(this.controls).forEach((modeType) => {
      const section = this.controls[modeType];

      return Object.keys(section).forEach((modeName) => {
        const mode = modeName as ModeName;
        const control = this.getControl({ modeType: modeType, modeName: mode });
        const controlOptions = this.gm.options.getControlOptions({
          modeType: modeType,
          modeName: mode,
        });

        if (control && controlOptions) {
          callback({ control, controlOptions });
        }
        // else {
        //   log.warn(`Can't find control section for: ${actionType}:${modeName}`, !!actionType, !!modeName);
        // }
      });
    });
  }

  getControl({
    modeType,
    modeName,
  }: {
    modeType: ModeType;
    modeName: ModeName;
  }): GenericSystemControl | null {
    if (modeType && modeName) {
      const section = this.controls[modeType] as GenericSystemControls;
      return (section[modeName] || null) as GenericSystemControl | null;
    }

    return null;
  }

  getDefaultPosition(): BaseControlsPosition {
    return this.gm.options.settings.controlsPosition;
  }
}
