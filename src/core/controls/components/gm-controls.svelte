<script lang="ts">
  import caretDown from '@/assets/images/controls2/caret-down.svg';
  import caretUp from '@/assets/images/controls2/caret-up.svg';
  import ActionControl from '@/core/controls/components/action-control.svelte';
  import { controlsStore } from '@/core/controls/components/controls-store.ts';
  import type { ActionType, GenericSystemControls, ModeName } from '@/main.ts';
  import DOMPurify from 'dompurify';
  import { onDestroy } from 'svelte';
  import { slide } from 'svelte/transition';

  let { controls, options } = $controlsStore;
  // const gm: Geoman = getContext('gm');
  let expanded = $state(true);

  const unsubscribe = controlsStore.subscribe((value) => {
    controls = value.controls;
    options = value.options;
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

<div class="gm-reactive-controls">
  {#if $controlsStore.settings.controlsCollapsible}
    <div class={`${$controlsStore.settings.controlsStyles.controlGroupClass} group-settings`}>
      <button class="gm-control-button" onclick={toggleExpanded}>
        {@html getToggleExpandedIcon()}
      </button>
    </div>
  {/if}

  {#if expanded}
    <div class="animation-container" in:slide={{ duration: 180 }} out:slide={{ duration: 140 }}>
      {#each Object.entries(options) as [groupKey, groupControls]}
        <div class={`${$controlsStore.settings.controlsStyles.controlGroupClass} group-${groupKey}`}>
          {#each Object.entries(groupControls) as [controlKey, controlOptions]}
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
