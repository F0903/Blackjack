<script lang="ts">
  export let hidden = false;
</script>

<div class="overlay" class:hidden>
  <slot />
</div>

<style>
  .overlay.hidden {
    display: none;
  }

  .overlay {
    position: absolute;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.5);

    width: 100vw;
    height: 100vh;
  }
</style>
