<script>
  import Blackjack from "$lib/Blackjack.svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";

  // The window is hidden by default to avoid the WebView "flicker".
  onMount(() => invoke("show_window"));
</script>

<Blackjack />

<style>
  :global(body) {
    margin: 0;
  }

  :root {
    --primary-color: hsl(111, 40%, 14%);
    --secondary-color: hsl(0, 0%, 13%);
    --tertiary-color: hsl(0, 0%, 20%);
    --highlight-color: hsl(37, 43%, 44%);

    --primary-text-color: hsl(0, 0%, 85%);

    box-sizing: border-box;

    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    background-color: var(--primary-color);
    color: var(--primary-text-color);

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
</style>
