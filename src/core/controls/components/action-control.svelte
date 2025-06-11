<script lang="ts">
  import ControlMenu from '@/core/controls/components/control-menu.svelte';
  import type { ControlOptions, GenericSystemControl, Geoman } from '@/main.ts';
  import DOMPurify from 'dompurify';
  import log from 'loglevel';
  import { getContext } from 'svelte';

  const { control, controlOptions }: {
    control: GenericSystemControl,
    controlOptions: ControlOptions,
  } = $props();

  const sanitizedSvg = controlOptions?.icon ? DOMPurify.sanitize(controlOptions.icon.trim()) : null;

  const gm: Geoman = getContext('gm');
  const menuPosition = gm.control.getDefaultPosition();

  const handleClick = () => {
    if (control && controlOptions) {
      gm.options.toggleMode(control.type, control.targetMode);
    } else {
      log.error('Control or controlOptions not defined', control, controlOptions);
    }
  };
</script>

{#if control && controlOptions && controlOptions.uiEnabled}
  <div class="control-container">
    <button
      type="button"
      id={`id_${control.type}_${control.targetMode}`}
      class={`gm-control-button ${control.type}-${control.targetMode}`}
      class:active={controlOptions.active}
      title={controlOptions.title}
      onclick={handleClick}>
      {#if controlOptions.icon}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html sanitizedSvg}
      {:else if controlOptions.title}
        {controlOptions.title.slice(0, 2)}
      {:else}
        {control.targetMode}
      {/if}
    </button>
    {#if controlOptions.active}
      <div
        class="control-menu"
        class:menu-right={menuPosition.endsWith('left')}
        class:menu-left={menuPosition.endsWith('right')}>
        <ControlMenu control={control} />
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .control-container {
    position: relative;

    .control-menu {
      position: absolute;
      top: 0;
      display: flex;
      flex-direction: column;
      background: white;
      box-shadow: 4px 0 0 2px rgba(0, 0, 0, 0.1);
      clip-path: inset(-2px -2px -2px 0 round 3px);

      &.menu-right {
        left: 100%;
        border-radius: 0 3px 3px 0;
      }

      // todo: auto adjust menu position
      &.menu-left {
        right: 100%;
        border-radius: 3px 0 0 3px;
      }
    }
  }
</style>
