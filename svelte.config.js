import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// `vitePreprocess` runs <script lang="ts"> and <style lang="scss"> through Vite's own
// transform pipeline. It replaces `svelte-preprocess`, which drove TypeScript through
// the compiler API (`typescript.convertCompilerOptionsFromJson`) — an entry point TS 7
// removed, and which pinned us to `typescript ^5 || ^6`.
export default {
  preprocess: vitePreprocess(),
};
