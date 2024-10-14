<script lang="ts">
  export let color: string;
  export let text_color: string;
  export let border_radius: string;
</script>

<div
  class="text-container"
  style="background-color: {color}; border-radius: {border_radius};"
>
  <span style="color: {text_color};"><slot /></span>
</div>

<style>
  .text-container {
    margin: 10px;
    padding: 15px;
  }
  span {
    text-align: center;

    font-family: Arial;
    font-weight: 800;
  }
</style>
