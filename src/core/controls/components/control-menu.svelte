<script lang="ts">
  import ActionOption from '@/core/controls/components/action-option.svelte';
  import SubAction from '@/core/controls/components/sub-action.svelte';
  import type { ActionInstance, GenericSystemControl, Geoman } from '@/main.ts';
  import { getContext } from 'svelte';

  const gm: Geoman = getContext('gm');
  const { control }: { control: GenericSystemControl } = $props();

  const actionType = control.type;
  const modeName = control.targetMode;

  let actionInstance: ActionInstance | null = $state(null);

  if (actionType && modeName) {
    actionInstance = gm.actionInstances[`${actionType}__${modeName}`] || null;
  }
</script>

{#if actionInstance}
  {#each Object.entries(actionInstance.options) as [key, item] (key)}
    <ActionOption
      name={key}
      actionInstance={actionInstance}
      actionOption={item} />
  {/each}
  {#each Object.entries(actionInstance.actions) as [key, item] (key)}
    <SubAction
      name={key}
      actionInstance={actionInstance}
      subAction={item} />
  {/each}
{/if}

<style lang="scss">
</style>
