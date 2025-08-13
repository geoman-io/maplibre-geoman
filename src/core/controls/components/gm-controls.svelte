<script lang="ts">
  import caretDown from '@/assets/images/controls2/caret-down.svg';
  import caretUp from '@/assets/images/controls2/caret-up.svg';
  import ActionControl from '@/core/controls/components/action-control.svelte';
  import { controlsStore } from '@/core/controls/components/controls-store.ts';
  import type { ActionType, GenericSystemControls, ModeName } from '@/main.ts';
  import DOMPurify from 'dompurify';
  import { slide } from 'svelte/transition';

  // const gm: Geoman = getContext('gm');
  let expanded = $state(true);
  let controlsCollapsible = $derived($controlsStore.settings.controlsCollapsible);
  let controlsStyles = $derived($controlsStore.settings.controlsStyles);

  const getControl = (groupKey: string, mode: string) => {
    const controlSection = (
      $controlsStore.controls?.[groupKey as ActionType] as GenericSystemControls | undefined
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

<div class="gm-reactive-controls">
  {#if controlsCollapsible}
    <div class={`${controlsStyles.controlGroupClass} group-settings`}>
      <button class="gm-control-button" onclick={toggleExpanded}>
        {@html getToggleExpandedIcon()}
      </button>
    </div>
  {/if}

  {#if expanded}
    <div class="animation-container" in:slide={{ duration: 180 }} out:slide={{ duration: 140 }}>
      {#each Object.entries($controlsStore.options) as [groupKey, groupControls] (groupKey)}
        <div class={`${controlsStyles.controlGroupClass} group-${groupKey}`}>
          {#each Object.entries(groupControls) as [controlKey, controlOptions] (controlKey)}
            {@const control = getControl(groupKey, controlKey)}
            {#if control}
              <ActionControl control={control} controlOptions={controlOptions} />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .gm-reactive-controls {
    display: flex;
    flex-direction: column;
  }

  .animation-container {
    overflow: hidden;
  }
</style>
