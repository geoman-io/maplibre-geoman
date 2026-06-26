<script lang="ts">
  import { controlsStore } from '@/core/controls/components/controls-store.ts';
  import type { CustomControl } from '@/types/controls.ts';
  import type { Geoman } from '@/main.ts';
  import DOMPurify from 'dompurify';
  import log from 'loglevel';
  import { getContext } from 'svelte';

  const { control }: { control: CustomControl } = $props();

  const gm: Geoman = getContext('gm');
  const sanitizedSvg = $derived(control.icon ? DOMPurify.sanitize(control.icon.trim()) : null);

  const handleClick = async (event: MouseEvent) => {
    try {
      await control.onClick({ gm, control, event });
    } catch (error) {
      log.error(`Custom control "${control.id}" onClick handler failed`, error);
    }
  };
</script>

<div class={$controlsStore.settings.controlsStyles.controlContainerClass}>
  <button
    type="button"
    id={`id_custom_${control.id}`}
    class={`${$controlsStore.settings.controlsStyles.controlButtonClass} custom-${control.id}`}
    class:active={control.active}
    title={control.title}
    onclick={handleClick}>
    {#if sanitizedSvg}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- sanitized with DOMPurify -->
      {@html sanitizedSvg}
    {:else if control.title}
      {control.title.slice(0, 2)}
    {:else}
      {control.id.slice(0, 2)}
    {/if}
  </button>
</div>

<style></style>
