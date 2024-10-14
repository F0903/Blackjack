<script lang="ts">
  export let color: string;
  export let border_radius: string;
</script>

<div
  class="controls-container"
  style="background-color: {color}; border-radius: {border_radius};"
>
  <slot />
</div>

<style>
  .controls-container {
    background-color: rgb(61, 61, 61);

    width: fit-content;
    height: fit-content;

    margin-top: auto;
    margin-left: auto;
    margin-right: auto;

    display: flex;
    flex-direction: row;
  }
</style>
