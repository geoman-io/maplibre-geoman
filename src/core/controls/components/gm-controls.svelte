<script lang="ts">
  import caretDown from '@/assets/images/controls2/caret-down.svg';
  import caretUp from '@/assets/images/controls2/caret-up.svg';
  import ActionControl from '@/core/controls/components/action-control.svelte';
  import { controlsStore } from '@/core/controls/components/controls-store.ts';
  import type { ActionType, GenericSystemControls, Geoman, ModeName } from '@/main.ts';
  import DOMPurify from 'dompurify';
  import { getContext, onDestroy } from 'svelte';

  let { controls, options } = $controlsStore;
  const gm: Geoman = getContext('gm');
  const mapName = `${gm.mapAdapter.mapType}gl`;
  let controlsCollapsable = $state(false);
  let expanded = $state(true);

  const unsubscribe = controlsStore.subscribe((value) => {
    controls = value.controls;
    options = value.options;
    controlsCollapsable = value.settings.controlsCollapsable;
  });

  onDestroy(unsubscribe);

  const getControl = (groupKey: string, mode: string) => {
    const controlSection = (
      controls?.[groupKey as ActionType] as GenericSystemControls | undefined
    );
    return controlSection?.[mode as ModeName] || null;
  };

  const toggleExpanded = () => {
    expanded = !expanded;
  };

  const getToggleExpandedIcon = () => {
    return DOMPurify.sanitize(expanded ? caretDown : caretUp);
  };
</script>

<style>
  .gm-reactive-controls {
    color: brown;
  }
</style>

<div class="gm-reactive-controls">
  {#if controlsCollapsable}
    <div class={`${mapName}-ctrl ${mapName}-ctrl-group group-settings`}>
      <button class="gm-control-button" onclick={toggleExpanded}>
        {@html getToggleExpandedIcon()}
      </button>
    </div>
  {/if}

  {#if expanded}
    {#each Object.entries(options) as [groupKey, groupControls]}
      <div class={`${mapName}-ctrl ${mapName}-ctrl-group group-${groupKey}`}>
        {#each Object.entries(groupControls) as [controlKey, controlOptions]}
          {@const control = getControl(groupKey, controlKey)}
          {#if control}
            <ActionControl control={control} controlOptions={controlOptions} />
          {/if}
        {/each}
      </div>
    {/each}
  {/if}
</div>
