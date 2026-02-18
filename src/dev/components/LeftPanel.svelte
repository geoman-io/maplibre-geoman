<script lang="ts">
  import type {DrawModeName, EditModeName, Geoman, HelperModeName,} from '@/main.ts';
  import {DRAW_MODES, EDIT_MODES, HELPER_MODES} from '@/modes/constants.ts';

  interface Props {
    geoman: Geoman | null;
  }

  let { geoman }: Props = $props();

  // Section collapse states
  let settingsExpanded = $state(true);
  let drawModesExpanded = $state(true);
  let editModesExpanded = $state(true);
  let helperModesExpanded = $state(true);

  // Settings state
  let throttlingDelay = $state(10);
  let awaitDataUpdates = $state(true);
  let snappingEnabled = $state(false);
  let snappingDistance = $state(18);
  let allowSelfIntersection = $state(true);

  // Active modes tracking
  let activeDrawModes = $state<DrawModeName[]>([]);
  let activeEditModes = $state<EditModeName[]>([]);
  let activeHelperModes = $state<HelperModeName[]>([]);

  // Sync settings from geoman when it changes
  $effect(() => {
    if (geoman) {
      activeDrawModes = geoman.getActiveDrawModes();
      activeEditModes = geoman.getActiveEditModes();
      activeHelperModes = geoman.getActiveHelperModes();
      snappingDistance = geoman.options.settings.snapDistance;
    }
  });

  // Sync snap distance changes back to geoman
  $effect(() => {
    if (geoman && snappingDistance > 0) {
      geoman.options.settings.snapDistance = snappingDistance;
    }
  });

  const toggleSection = (section: string) => {
    switch (section) {
      case 'settings':
        settingsExpanded = !settingsExpanded;
        break;
      case 'draw':
        drawModesExpanded = !drawModesExpanded;
        break;
      case 'edit':
        editModesExpanded = !editModesExpanded;
        break;
      case 'helper':
        helperModesExpanded = !helperModesExpanded;
        break;
    }
  };

  const toggleDrawMode = (mode: DrawModeName) => {
    if (!geoman) return;
    const isAvailable = geoman.options.isModeAvailable('draw', mode);
    if (!isAvailable) return;

    geoman.options.toggleMode('draw', mode);
    activeDrawModes = geoman.getActiveDrawModes();
    activeEditModes = geoman.getActiveEditModes();
    activeHelperModes = geoman.getActiveHelperModes();
  };

  const toggleEditMode = (mode: EditModeName) => {
    if (!geoman) return;
    const isAvailable = geoman.options.isModeAvailable('edit', mode);
    if (!isAvailable) return;

    geoman.options.toggleMode('edit', mode);
    activeDrawModes = geoman.getActiveDrawModes();
    activeEditModes = geoman.getActiveEditModes();
    activeHelperModes = geoman.getActiveHelperModes();
  };

  const toggleHelperMode = (mode: HelperModeName) => {
    if (!geoman) return;
    const isAvailable = geoman.options.isModeAvailable('helper', mode);
    if (!isAvailable) return;

    geoman.options.toggleMode('helper', mode);
    activeDrawModes = geoman.getActiveDrawModes();
    activeEditModes = geoman.getActiveEditModes();
    activeHelperModes = geoman.getActiveHelperModes();
  };

  const disableAllModes = () => {
    if (!geoman) return;
    geoman.disableAllModes();
    activeDrawModes = [];
    activeEditModes = [];
    activeHelperModes = [];
  };

  const isModeAvailable = (
    type: 'draw' | 'edit' | 'helper',
    mode: DrawModeName | EditModeName | HelperModeName,
  ): boolean => {
    if (!geoman) return false;
    return geoman.options.isModeAvailable(type, mode);
  };

  const formatModeName = (mode: string): string => {
    return mode.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };
</script>

<div class="dev-panel-header">
  <span>Settings & Controls</span>
</div>

<div class="dev-panel-content">
  <!-- Global Settings Section -->
  <div class="dev-section">
    <div
      class="dev-section-header"
      class:collapsed={!settingsExpanded}
      onclick={() => toggleSection('settings')}
      onkeydown={(e) => e.key === 'Enter' && toggleSection('settings')}
      role="button"
      tabindex="0"
    >
      <span>Global Settings</span>
      <span class="toggle-icon">&#9660;</span>
    </div>
    <div class="dev-section-content" class:collapsed={!settingsExpanded}>
      <div class="dev-control-row">
        <label for="throttle-delay">Throttle Delay (ms)</label>
        <input
          id="throttle-delay"
          type="number"
          class="dev-input"
          bind:value={throttlingDelay}
          min="0"
          max="1000"
        />
      </div>

      <div class="dev-control-row">
        <label for="await-updates">Await Data Updates</label>
        <label class="dev-toggle">
          <input type="checkbox" id="await-updates" bind:checked={awaitDataUpdates} />
          <span class="dev-toggle-slider"></span>
        </label>
      </div>

      <div class="dev-control-row">
        <label for="snapping">Snapping</label>
        <label class="dev-toggle">
          <input
            type="checkbox"
            id="snapping"
            bind:checked={snappingEnabled}
            onchange={() => {
              if (geoman && snappingEnabled) {
                toggleHelperMode('snapping');
              }
            }}
          />
          <span class="dev-toggle-slider"></span>
        </label>
      </div>

      <div class="dev-control-row">
        <label for="snap-distance">Snap Distance (px)</label>
        <input
          id="snap-distance"
          type="number"
          class="dev-input"
          bind:value={snappingDistance}
          min="1"
          max="100"
        />
      </div>

      <div class="dev-control-row">
        <label for="self-intersect">Allow Self Intersection</label>
        <label class="dev-toggle">
          <input type="checkbox" id="self-intersect" bind:checked={allowSelfIntersection} />
          <span class="dev-toggle-slider"></span>
        </label>
      </div>

      <div class="dev-btn-row">
        <button class="dev-btn danger" onclick={disableAllModes}>Disable All Modes</button>
      </div>
    </div>
  </div>

  <!-- Draw Modes Section -->
  <div class="dev-section">
    <div
      class="dev-section-header"
      class:collapsed={!drawModesExpanded}
      onclick={() => toggleSection('draw')}
      onkeydown={(e) => e.key === 'Enter' && toggleSection('draw')}
      role="button"
      tabindex="0"
    >
      <span>Draw Modes</span>
      <span class="toggle-icon">&#9660;</span>
    </div>
    <div class="dev-section-content" class:collapsed={!drawModesExpanded}>
      <div class="dev-mode-grid">
        {#each DRAW_MODES as mode}
          {@const isActive = activeDrawModes.includes(mode)}
          {@const isAvailable = isModeAvailable('draw', mode)}
          <button
            class="dev-mode-btn"
            class:active={isActive}
            class:disabled={!isAvailable}
            onclick={() => toggleDrawMode(mode)}
            title={isAvailable ? `Toggle ${mode} mode` : `${mode} mode not available`}
          >
            {formatModeName(mode)}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Edit Modes Section -->
  <div class="dev-section">
    <div
      class="dev-section-header"
      class:collapsed={!editModesExpanded}
      onclick={() => toggleSection('edit')}
      onkeydown={(e) => e.key === 'Enter' && toggleSection('edit')}
      role="button"
      tabindex="0"
    >
      <span>Edit Modes</span>
      <span class="toggle-icon">&#9660;</span>
    </div>
    <div class="dev-section-content" class:collapsed={!editModesExpanded}>
      <div class="dev-mode-grid">
        {#each EDIT_MODES as mode}
          {@const isActive = activeEditModes.includes(mode)}
          {@const isAvailable = isModeAvailable('edit', mode)}
          <button
            class="dev-mode-btn"
            class:active={isActive}
            class:disabled={!isAvailable}
            onclick={() => toggleEditMode(mode)}
            title={isAvailable ? `Toggle ${mode} mode` : `${mode} mode not available`}
          >
            {formatModeName(mode)}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Helper Modes Section -->
  <div class="dev-section">
    <div
      class="dev-section-header"
      class:collapsed={!helperModesExpanded}
      onclick={() => toggleSection('helper')}
      onkeydown={(e) => e.key === 'Enter' && toggleSection('helper')}
      role="button"
      tabindex="0"
    >
      <span>Helper Modes</span>
      <span class="toggle-icon">&#9660;</span>
    </div>
    <div class="dev-section-content" class:collapsed={!helperModesExpanded}>
      <div class="dev-mode-grid">
        {#each HELPER_MODES as mode}
          {@const isActive = activeHelperModes.includes(mode)}
          {@const isAvailable = isModeAvailable('helper', mode)}
          <button
            class="dev-mode-btn"
            class:active={isActive}
            class:disabled={!isAvailable}
            onclick={() => toggleHelperMode(mode)}
            title={isAvailable ? `Toggle ${mode} mode` : `${mode} mode not available`}
          >
            {formatModeName(mode)}
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>

<div class="dev-shortcuts-hint">
  <kbd>Ctrl</kbd>+<kbd>1</kbd> Toggle left panel
</div>
