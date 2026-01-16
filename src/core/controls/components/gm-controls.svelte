<script lang="ts">
  import caretDown from '@/assets/images/controls2/caret-down.svg';
  import caretUp from '@/assets/images/controls2/caret-up.svg';
  import ActionControl from '@/core/controls/components/action-control.svelte';
  import { controlsStore } from '@/core/controls/components/controls-store.ts';
  import type {ActionType, ControlOptions, GenericSystemControls, ModeName} from '@/main.ts';
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

  const hasVisibleControls = (groupKey: string, groupControls: Record<string, unknown>) => {
    return Object.entries(groupControls).some(([controlKey, controlOptions]) => {
      const control = getControl(groupKey, controlKey);
      return control && controlOptions && (controlOptions as { uiEnabled?: boolean }).uiEnabled;
    });
  };

  const toggleExpanded = () => {
    expanded = !expanded;
  };

  const getToggleExpandedIcon = () => {
    return DOMPurify.sanitize(expanded ? caretDown : caretUp);
  };

  const sortControlEntries = (
          groupControls: Record<string, ControlOptions>
  ): Array<[string, ControlOptions]> => {
    return Object.entries(groupControls).sort(([, optionsA], [, optionsB]) => {
      const orderA = optionsA.order || 0;
      const orderB = optionsB.order || 0;
      return orderA - orderB;
    });
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
    <div in:slide={{ duration: 180 }} out:slide={{ duration: 140 }}>
      {#each Object.entries($controlsStore.options) as [groupKey, groupControls] (groupKey)}
        {#if hasVisibleControls(groupKey, groupControls)}
          <div class={`${controlsStyles.controlGroupClass} group-${groupKey}`}>
            {#each sortControlEntries(groupControls) as [controlKey, controlOptions] (controlKey)}
              {@const control = getControl(groupKey, controlKey)}
              {#if control}
                <ActionControl control={control} controlOptions={controlOptions} />
              {/if}
            {/each}
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
</style>
