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
      <Hand
        label="Dealer"
        hand_color="var(--secondary-color)"
        hand={$dealer_hand}
      ></Hand>
    </div>
    <div class="player-container">
      {#each $player.getHands() as hand}
        <Hand label="You" hand_color="var(--secondary-color)" {hand}></Hand>
      {/each}
    </div>
  </div>
  <Controls color="var(--secondary-color)" border_radius="25px">
    {#if $double_available}
      <Button
        interactable={$game_interactable}
        on:click={double}
        color="var(--tertiary-color)"
        text_color="white"
        font_weight="600"
        border_radius="25px">DOUBLE</Button
      >
    {/if}
    {#if $split_available}
      <Button
        interactable={$game_interactable}
        on:click={split}
        color="var(--tertiary-color)"
        text_color="white"
        font_weight="600"
        border_radius="25px">SPLIT</Button
      >
    {/if}
    <Button
      interactable={$game_interactable}
      on:click={hit}
      color="var(--tertiary-color)"
      text_color="white"
      font_weight="600"
      border_radius="25px">HIT</Button
    >
    <TextBox
      color="var(--tertiary-color)"
      text_color="var(--highlight-color)"
      border_radius="25px">{"$" + $player.getBalance()}</TextBox
    >
    <Button
      interactable={$game_interactable}
      on:click={stand}
      color="var(--tertiary-color)"
      text_color="var(--primary-text-color)"
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
    gap: 15px;
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

    box-shadow: inset 0px 0px 200px 0px rgba(0, 0, 0, 0.7);
  }
</style>
