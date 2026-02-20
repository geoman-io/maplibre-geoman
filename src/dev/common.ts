import { layerStyles } from '@/dev/styles/layer-styles.ts';
import { Geoman, type GmOptionsData, type MapInstanceWithGeoman } from '@/main.ts';
import log from 'loglevel';
import type { PartialDeep } from 'type-fest';
import { mount, unmount } from 'svelte';
import LeftPanel from '@/dev/components/LeftPanel.svelte';
import RightPanel from '@/dev/components/RightPanel.svelte';
import { CONTROL_GROUP_CLASS } from '@mapLib/constants.ts';

export function createGmOptions(): PartialDeep<GmOptionsData> {
  return {
    settings: {
      controlsPosition: 'top-left',
      useDefaultLayers: true,
      controlsUiEnabledByDefault: true,
      controlsCollapsible: true,
      controlsStyles: {
        controlGroupClass: CONTROL_GROUP_CLASS,
        controlContainerClass: 'gm-control-container',
        controlButtonClass: 'gm-control-button',
      },
    },
    layerStyles: layerStyles,
    controls: {
      edit: {
        drag: {
          title: 'Drag',
          uiEnabled: true,
        },
      },
      draw: {},
      helper: {
        shape_markers: {
          active: false,
          uiEnabled: true,
        },
      },
    },
  };
}

/** Minimal map interface covering methods used by dev tooling. */
export interface DevMapInstance {
  on(type: string, listener: (e: unknown) => void): unknown;
  getStyle():
    | {
        sources?: Record<string, unknown>;
        layers?: Array<{ id: string; type: string; source?: string }>;
      }
    | undefined;
  getSource(id: string): unknown;
}

// --- Panel management ---

const STORAGE_KEY = 'gm-dev-panels';

interface PanelState {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
}

const loadPanelState = (): PanelState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return { leftCollapsed: false, rightCollapsed: false };
};

const savePanelState = (state: PanelState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

let leftPanelComponent: ReturnType<typeof mount> | null = null;
let rightPanelComponent: ReturnType<typeof mount> | null = null;
const panelState = loadPanelState();

const leftPanelElement = document.getElementById('dev-left-panel');
const rightPanelElement = document.getElementById('dev-right-panel');

// Apply initial panel state
if (leftPanelElement && panelState.leftCollapsed) {
  leftPanelElement.classList.add('collapsed');
}
if (rightPanelElement && panelState.rightCollapsed) {
  rightPanelElement.classList.add('collapsed');
}

export const toggleLeftPanel = () => {
  if (!leftPanelElement) return;
  leftPanelElement.classList.toggle('collapsed');
  panelState.leftCollapsed = leftPanelElement.classList.contains('collapsed');
  savePanelState(panelState);
};

export const toggleRightPanel = () => {
  if (!rightPanelElement) return;
  rightPanelElement.classList.toggle('collapsed');
  panelState.rightCollapsed = rightPanelElement.classList.contains('collapsed');
  savePanelState(panelState);
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl+1 or Cmd+1 to toggle left panel
  if ((e.ctrlKey || e.metaKey) && e.key === '1') {
    e.preventDefault();
    toggleLeftPanel();
  }
  // Ctrl+2 or Cmd+2 to toggle right panel
  if ((e.ctrlKey || e.metaKey) && e.key === '2') {
    e.preventDefault();
    toggleRightPanel();
  }
});

export const mountPanels = (geoman: Geoman, map: DevMapInstance) => {
  if (leftPanelElement && !leftPanelComponent) {
    leftPanelComponent = mount(LeftPanel, {
      target: leftPanelElement,
      props: {
        geoman,
      },
    });
  }

  if (rightPanelElement && !rightPanelComponent) {
    rightPanelComponent = mount(RightPanel, {
      target: rightPanelElement,
      props: {
        geoman,
        map,
      },
    });
  }
};

export const unmountPanels = async () => {
  if (leftPanelComponent) {
    await unmount(leftPanelComponent);
    leftPanelComponent = null;
  }
  if (rightPanelComponent) {
    await unmount(rightPanelComponent);
    rightPanelComponent = null;
  }
  // Clear panel content
  if (leftPanelElement) {
    leftPanelElement.innerHTML = '';
  }
  if (rightPanelElement) {
    rightPanelElement.innerHTML = '';
  }
};

// --- Geoman init ---

export async function initGeomanInstance(
  map: object,
  gmOptions: PartialDeep<GmOptionsData>,
): Promise<Geoman> {
  if (window.geoman) {
    console.error('Geoman is already initialized', window.geoman);
  }

  let geoman = new Geoman(map, gmOptions);
  await geoman.destroy();
  geoman = new Geoman(map, gmOptions);
  await geoman.waitForGeomanLoaded();

  (map as { on: (event: string, cb: (event: unknown) => void) => void }).on(
    'gm:create',
    (event: unknown) => {
      const e = event as {
        feature: { getGeoJson: () => unknown; source: { getGeoJson: () => unknown } };
      };
      console.log('feature geojson', e.feature.getGeoJson());
      console.log('source geojson', e.feature.source.getGeoJson());
    },
  );

  return geoman;
}

// --- Dev environment setup ---

export function setupDevEnvironment(geoman: Geoman, map: DevMapInstance): void {
  window.geoman = geoman;
  window.customData ??= { eventResults: {} };
  window.customData.map = map as unknown as MapInstanceWithGeoman;

  mountPanels(geoman, map);

  log.debug('geoman version:', __GEOMAN_VERSION__);
  log.debug('Dev panels mounted');
}
