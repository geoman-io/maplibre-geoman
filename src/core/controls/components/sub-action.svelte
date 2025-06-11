<script lang="ts">
  import type { ActionInstance, SubAction } from '@/main.ts';
  import log from 'loglevel';

  const { actionInstance, subAction }: {
    actionInstance: ActionInstance | null,
    subAction: SubAction | null,
  } = $props();

  const handleSubAction = (event: Event) => {
    event.preventDefault();
    if (!actionInstance || !subAction) {
      log.error('Can\'t run a SubAction', actionInstance, subAction);
      return;
    }
    subAction.method();
  };
</script>

{#if subAction}
  <button
    type="submit"
    class="sub-action"
    title={subAction.label}
    onclick={handleSubAction}>
    {subAction.label}
  </button>
{/if}

<style lang="scss">
  .sub-action {
    width: auto;
    height: auto;
    border: 1px solid #ccc;
    margin: 3px;
    padding: 3px;
  }
</style>
