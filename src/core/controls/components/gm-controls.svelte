<script lang="ts">
  import ActionControl from '@/core/controls/components/action-control.svelte';
  import { controlsStore } from '@/core/controls/components/controls-store.ts';
  import type { ActionType, GenericSystemControls, Geoman, ModeName } from '@/main.ts';
  import { getContext, onDestroy } from 'svelte';

  let { controls, options } = $controlsStore;
  const gm: Geoman = getContext('gm');
  const mapName = `${gm.mapAdapter.mapType}gl`;

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
</script>

<style>
  .gm-reactive-controls {
    color: brown;
  }
</style>

<div class="gm-reactive-controls">
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
</div>
