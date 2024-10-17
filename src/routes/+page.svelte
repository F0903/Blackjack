<script lang="ts">
  import Button from "../lib/controls/Button.svelte";
  import Controls from "../lib/controls/Controls.svelte";
  import TextBox from "../lib/controls/TextBox.svelte";
  import Hand from "../lib/Hand.svelte";
  import { hit, stand, split, double } from "$lib/game/game";
  import StartPrompt from "$lib/StartPrompt.svelte";
  import {
    dealer_hand,
    split_available,
    player,
    double_available,
    game_interactable,
  } from "$lib/game/stores";
</script>

<StartPrompt />
<div class="container">
  <div class="table">
    <div class="dealer-container">
      <Hand label="Dealer" hand_color="rgb(65, 65, 65)" hand={$dealer_hand}
      ></Hand>
    </div>
    <div class="player-container">
      {#each $player.getHands() as hand}
        <Hand label="You" hand_color="rgb(65, 65, 65)" {hand}></Hand>
      {/each}
    </div>
  </div>
  <Controls color="rgb(85, 85, 85)" border_radius="25px">
    {#if $double_available}
      <Button
        interactable={$game_interactable}
        on:click={double}
        color="rgb(65, 65, 65)"
        text_color="white"
        font_weight="600"
        border_radius="25px">DOUBLE</Button
      >
    {/if}
    {#if $split_available}
      <Button
        interactable={$game_interactable}
        on:click={split}
        color="rgb(65, 65, 65)"
        text_color="white"
        font_weight="600"
        border_radius="25px">SPLIT</Button
      >
    {/if}
    <Button
      interactable={$game_interactable}
      on:click={hit}
      color="rgb(65, 65, 65)"
      text_color="white"
      font_weight="600"
      border_radius="25px">HIT</Button
    >
    <TextBox
      color="rgb(50, 50, 50)"
      text_color="rgb(100, 145, 97)"
      border_radius="25px">{"$" + $player.getBalance()}</TextBox
    >
    <Button
      interactable={$game_interactable}
      on:click={stand}
      color="rgb(65, 65, 65)"
      text_color="white"
      font_weight="600"
      border_radius="25px">STAND</Button
    >
  </Controls>
</div>

<style>
  .table {
    margin: auto;

    display: flex;
    flex-direction: column;
    place-items: center;
    place-content: center;
    gap: 25px;
  }

  .player-container {
    margin-top: auto;
    margin-left: auto;
    margin-right: auto;

    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .container {
    margin: 0;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    box-sizing: border-box;

    width: 100vw;
    height: 100vh;
  }

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
