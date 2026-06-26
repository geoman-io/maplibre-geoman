import type { DrawModeName, EditModeName, HelperModeName } from '@/types/modes/index.ts';
import type { ActionType, ModeType } from '@/types/options.ts';

export interface ControlSettings {
  exclusive: boolean;
  enabledBy?: Array<ModeName>;
}

/** Context passed to a custom control's click handler. */
export interface CustomControlClickContext {
  gm: import('@/main.ts').Geoman;
  control: CustomControl;
  event: MouseEvent;
}

/**
 * A host-defined control-bar button that runs an arbitrary handler on click
 * instead of toggling a built-in mode. Provide these via the `customControls`
 * option or at run time through `gm.control.addCustomControl()`.
 */
export interface CustomControl {
  /** unique id; used for the button's id/class and for removal */
  id: string;
  /** tooltip text; its first two chars are the text fallback when no icon is set */
  title?: string;
  /** raw SVG markup for the icon (sanitized with DOMPurify before render) */
  icon?: string | null;
  /** invoked when the button is clicked */
  onClick: (context: CustomControlClickContext) => void | Promise<void>;
  /** sort order within the custom-control group (lower comes first) */
  order?: number;
  /** controlled active/pressed state for toggle-style buttons */
  active?: boolean;
}

export interface SystemControl<AT extends ActionType, Mode> {
  readonly type: AT;
  readonly targetMode: Mode;
  readonly eventType: 'toggle' | 'click';
  readonly settings: ControlSettings;
}

export interface SystemControls {
  readonly draw: Record<DrawModeName, SystemControl<'draw', DrawModeName>>;
  readonly edit: Record<EditModeName, SystemControl<'edit', EditModeName>>;
  readonly helper: Record<HelperModeName, SystemControl<'helper', HelperModeName>>;
}

export type ModeName = DrawModeName | EditModeName | HelperModeName;
export type GenericSystemControl = SystemControl<ModeType, ModeName>;
export type GenericSystemControls = {
  [key in ModeName]?: GenericSystemControl;
};

// export classes as types to make them available in main.ts for end users
export type { default as GMControl } from '@/core/controls/index.ts';
