import { layerStyles } from './styles/layer-styles.ts';
import { Geoman, IS_PRO } from '@/main.ts';
import { getGeoJsonBounds } from '@/utils/geojson.ts';
import type { AnyMapInstance, MapInstanceWithGeoman } from '@/types/map/index.ts';
import type { GmOptionsData } from '@/types/options.ts';
import log from 'loglevel';
import type { PartialDeep } from 'type-fest';
import { mount, unmount } from 'svelte';
import LeftPanel from './components/LeftPanel.svelte';
import RightPanel from './components/RightPanel.svelte';
import { CONTROL_GROUP_CLASS } from '@mapLib/constants.ts';

export function createGmOptions(): PartialDeep<GmOptionsData> {
  return {
    settings: {
      controlsPosition: 'top-left',
      useDefaultLayers: true,
      useControlsUi: true,
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
    // Demo: host-defined control-bar buttons (issue #205). Each runs its own
    // onClick handler instead of toggling a built-in mode. A control can also be
    // added/removed at run time via geoman.control.addCustomControl() — see the
    // toggle demo in setupDevEnvironment(). Docs: README "Custom controls".
    customControls: [
      {
        id: 'zoom-to-features',
        title: 'Zoom to features',
        order: 10,
        icon: `
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none"
               stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <circle cx="9" cy="9" r="5.5" />
            <line x1="13.5" y1="13.5" x2="18" y2="18" />
          </svg>`,
        onClick: ({ gm }) => {
          const geoJson = gm.features.getAll();
          if (geoJson.features.length) {
            gm.mapAdapter.fitBounds(getGeoJsonBounds(geoJson), { padding: 40 });
          }
        },
      },
    ],
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
  map: AnyMapInstance,
  gmOptions: PartialDeep<GmOptionsData>,
): Promise<Geoman> {
  if (window.geoman) {
    console.error('Geoman is already initialized', window.geoman);
  }

  let geoman = new Geoman(map, gmOptions);
  await geoman.destroy();
  geoman = new Geoman(map, gmOptions);
  await geoman.waitForGeomanLoaded();

  geoman.mapAdapter.on('gm:create', (event) => {
    log.debug('Event: "gm:create"', event.name);
    console.log('Feature geojson', event.feature.getGeoJson());
    console.log('Source geojson', event.feature.source.getGeoJson());
  });

  return geoman;
}

// --- Dev environment setup ---

export function setupDevEnvironment(geoman: Geoman, map: DevMapInstance): void {
  window.geoman = geoman;
  window.customData ??= { eventResults: {} };
  window.customData.map = map as unknown as MapInstanceWithGeoman;

  mountPanels(geoman, map);
  addDemoToggleControl(geoman);

  log.debug(`Geoman version: "${IS_PRO ? 'pro' : 'free'}"`);
  log.debug('Dev panels mounted');
}

// Demo of the runtime custom-control API (issue #205): a toggle button that
// re-adds itself with a flipped `active` (pressed) state on each click. Adding a
// control with an existing id replaces the previous one in place.
function addDemoToggleControl(geoman: Geoman): void {
  let active = false;
  const render = () => {
    geoman.control.addCustomControl({
      id: 'demo-toggle',
      title: active ? 'Demo toggle (on)' : 'Demo toggle (off)',
      order: 20,
      active,
      onClick: () => {
        active = !active;
        log.info(`Custom control "demo-toggle" is now ${active ? 'on' : 'off'}`);
        render();
      },
    });
  };
  render();
}
