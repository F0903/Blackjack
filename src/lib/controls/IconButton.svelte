<script lang="ts">
  export let color: string;
  export let text_color: string;
  export let font_weight: string;

  export let border_radius: string;
  export let size: string;
  export let padding: string | null = null;

  export let interactable: boolean = true;
</script>

<button
  on:click
  class:disabled={!interactable}
  style="background-color: {color}; color: {text_color}; border-radius: {border_radius}; font-weight: {font_weight}; width: {size}; height: {size}; padding: {padding};"
  ><slot /></button
>

<style>
  button.disabled {
    filter: brightness(0.5);
    cursor: none;
    pointer-events: none;
  }

  button:hover {
    filter: brightness(1.2);
  }

  button {
    border: 0;
    margin: 10px;

    text-align: center;
    cursor: pointer;
    user-select: none;

    aspect-ratio: 1;
    overflow: hidden;
  }
</style>
