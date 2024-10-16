<script lang="ts">
  export let color: string;
  export let text_color: string;
  export let border_radius: string;
  export let font_weight: string;
  export let font_size: string = "14px";
</script>

<button
  on:click
  style="background-color: {color}; color: {text_color}; border-radius: {border_radius}; font-weight: {font_weight}; font-size: {font_size}"
  ><slot /></button
>

<style>
  button {
    border: 0;
    margin: 10px;
    padding: 10px 16px;

    text-align: center;

    cursor: pointer;
  }
</style>
