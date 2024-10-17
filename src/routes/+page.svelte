<script>
  import Blackjack from "$lib/Blackjack.svelte";
</script>

<Blackjack />

<style>
  :global(:root > body) {
    margin: 0;
  }

  :root {
    --primary-color: rgb(41, 41, 41);
    --secondary-color: rgb(60, 60, 60);
    --tertiary-color: rgb(65, 65, 65);

    --primary-text-color: white;

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
