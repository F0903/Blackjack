<script lang="ts">
  import { onMount } from "svelte";
  import Button from "../lib/controls/Button.svelte";
  import Controls from "../lib/controls/Controls.svelte";
  import TextBox from "../lib/controls/TextBox.svelte";
  import Hand from "../lib/Hand.svelte";
  import {
    dealer_cards,
    player_cards,
    hit,
    player_balance,
  } from "$lib/game/game";

  onMount(() => {});
</script>

<div class="container">
  <div class="table">
    <div class="dealer-container">
      <Hand label="Dealer" hand_color="rgb(65, 65, 65)" cards={$dealer_cards}
      ></Hand>
    </div>
    <div class="player-container">
      <Hand label="You" hand_color="rgb(65, 65, 65)" cards={$player_cards}
      ></Hand>
    </div>
  </div>
  <Controls color="rgb(85, 85, 85)" border_radius="25px">
    <Button
      on:click={hit}
      color="rgb(65, 65, 65)"
      text_color="white"
      font_weight="600"
      border_radius="25px">HIT</Button
    >
    <TextBox
      color="rgb(50, 50, 50)"
      text_color="rgb(100, 145, 97)"
      border_radius="25px">{"$" + $player_balance}</TextBox
    >
    <Button
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
    box-sizing: border-box;

    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    background-color: #292929;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
</style>
