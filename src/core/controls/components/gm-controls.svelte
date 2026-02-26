<script lang="ts">
  import caretDown from '@/assets/images/controls2/caret-down.svg';
  import caretUp from '@/assets/images/controls2/caret-up.svg';
  import ActionControl from '@/core/controls/components/action-control.svelte';
  import { controlsStore } from '@/core/controls/components/controls-store.ts';
  import type { ControlOptions, GenericSystemControls, ModeName, ModeType } from '@/main.ts';
  import DOMPurify from 'dompurify';

  // const gm: Geoman = getContext('gm');
  let expanded = $state(true);
  let controlsCollapsible = $derived($controlsStore.settings.controlsCollapsible);
  let controlsStyles = $derived($controlsStore.settings.controlsStyles);

  const getControl = (groupKey: string, mode: string) => {
    const controlSection = (
      $controlsStore.controls?.[groupKey as ModeType] as GenericSystemControls | undefined
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

  // Sort controls by order property while preserving insertion order for undefined values
  const sortControlEntries = (groupControls: Record<string, ControlOptions>): Array<[string, ControlOptions]> => {
    return Object.entries(groupControls)
      .map(([key, options], originalIndex) => ({ key, options, originalIndex }))
      .sort((a, b) => {
        const orderA = a.options.order ?? Infinity;
        const orderB = b.options.order ?? Infinity;

        // Sort by order value, use original index as tiebreaker
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return a.originalIndex - b.originalIndex;
      })
      .map(({ key, options }) => [key, options] as [string, ControlOptions]);
  };
</script>

<div class="gm-reactive-controls">
  {#if controlsCollapsible}
    <div><!-- this div container is required -->
      <div class={`${controlsStyles.controlGroupClass} group-settings`}>
        <button class="gm-control-button" onclick={toggleExpanded}>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -- sanitized with DOMPurify -->
          {@html getToggleExpandedIcon()}
        </button>
      </div>
    </div>
  {/if}

  {#if expanded}
    <div>
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
