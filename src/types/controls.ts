import type { DrawModeName, EditModeName, HelperModeName } from '@/types/modes/index.ts';
import type { ActionType, ModeType } from '@/types/options.ts';

export interface ControlSettings {
  exclusive: boolean;
  enabledBy?: Array<ModeName>;
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
