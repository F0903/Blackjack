<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./controls/Button.svelte";
  import Controls from "./controls/Controls.svelte";
  import TextBox from "./controls/TextBox.svelte";
  import { start, onStart, onEnd } from "./game/game";
  import { player } from "./game/stores";
  import Overlay from "./Overlay.svelte";
  import IconButton from "./controls/IconButton.svelte";
  import PlusIcon from "./PlusIcon.svelte";
  import MinusIcon from "./MinusIcon.svelte";
  import { fly } from "svelte/transition";

  let hidden = false;

  const bet_increment = 10;
  let bet: number = bet_increment;
  let current_player_bal: number = $player.getBalance();

  let title = "Blackjack";

  function increaseBet() {
    if (bet + bet_increment > current_player_bal) return;
    bet += bet_increment;
  }

  function decreaseBet() {
    if (bet - bet_increment <= 0) return;
    bet -= bet_increment;
  }

  async function commitBet() {
    if (bet == 0) return;
    start(bet);
  }

  onMount(() => {
    const on_start = () => {
      console.log("game start");
      hidden = true;
    };
    onStart.sub(on_start);

    const on_end = () => {
      console.log("game end");
      hidden = false;
    };
    onEnd.sub(on_end);

    return () => {
      onStart.unsub(on_start);
      onEnd.unsub(on_end);
    };
  });
</script>

<Overlay {hidden}>
  <div class="start-prompt-container">
    <div class="start-prompt" class:hidden>
      <div class="title-container">
        <span>{title}</span>
      </div>
      <div class="balance-container">
        <div class="bet-text-container">
          <span>Place your bet:</span>
        </div>
        <TextBox
          border_radius="25px"
          color="var(--tertiary-color)"
          text_color="var(--highlight-color)">${$player.getBalance()}</TextBox
        >
      </div>
      <Controls color="var(--tertiary-color)" border_radius="25px">
        <IconButton
          on:click={increaseBet}
          border_radius="50%"
          color="var(--secondary-color)"
          font_weight="600"
          size="50px"
          padding="10px"
          text_color="var(--primary-text-color)"
          ><PlusIcon color="hsl(103, 50%, 25%)" /></IconButton
        >
        <TextBox
          border_radius="25px"
          color="var(--secondary-color)"
          text_color="var(--primary-text-color)">{bet}</TextBox
        >
        <IconButton
          on:click={decreaseBet}
          border_radius="50%"
          color="var(--secondary-color)"
          font_weight="500"
          size="50px"
          padding="10px"
          text_color="var(--primary-text-color)"
          ><MinusIcon color="hsl(2, 50%, 25%)" /></IconButton
        >
      </Controls>
      <div class="start-container">
        <Button
          on:click={commitBet}
          border_radius="25px"
          color="var(--tertiary-color)"
          font_weight="800"
          font_size="18px"
          text_color="var(--primary-text-color)">Start</Button
        >
      </div>
    </div>
  </div>
</Overlay>

<style>
  .start-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .bet-text-container {
    color: var(--primary-text-color);
    text-align: center;
  }

  .title-container {
    color: var(--primary-text-color);

    font-family: Arial;
    font-weight: 800;
    text-align: center;
    font-size: 21px;
    margin-bottom: 25px;
  }

  .start-prompt.hidden {
    margin-bottom: 50px;
    opacity: 25%;
  }

  .start-prompt {
    padding: 25px;
    background-color: var(--secondary-color);
    width: fit-content;
    height: fit-content;

    border-radius: 25px;

    opacity: 100%;
    margin-bottom: 0;

    transition:
      margin-bottom 0.4s,
      opacity 0.5s;
  }

  .start-prompt-container {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
