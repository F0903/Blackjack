<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./controls/Button.svelte";
  import Controls from "./controls/Controls.svelte";
  import TextBox from "./controls/TextBox.svelte";
  import { start, onStart, onEnd } from "./game/game";
  import { player } from "./game/stores";
  import Overlay from "./Overlay.svelte";

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
    <div class="start-prompt">
      <div class="title-container">
        <span>{title}</span>
      </div>
      <div class="balance-container">
        <div class="bet-text-container">
          <span>Place your bet:</span>
        </div>
        <TextBox border_radius="25px" color="black" text_color="white"
          >${$player.getBalance()}</TextBox
        >
      </div>
      <Controls color="grey" border_radius="25px">
        <Button
          on:click={increaseBet}
          border_radius="25px"
          color="black"
          font_weight="600"
          font_size="26px"
          text_color="white">+</Button
        >
        <TextBox border_radius="25px" color="black" text_color="white"
          >{bet}</TextBox
        >
        <Button
          on:click={decreaseBet}
          border_radius="25px"
          color="black"
          font_weight="500"
          font_size="26px"
          text_color="white">-</Button
        >
      </Controls>
      <div class="start-container">
        <Button
          on:click={commitBet}
          border_radius="25px"
          color="black"
          font_weight="800"
          font_size="18px"
          text_color="white">Start</Button
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
    color: white;
    text-align: center;
  }

  .start-prompt-container {
    display: flex;
    flex-direction: column;
    place-content: center;
    justify-content: center;

    width: 100%;
    height: 100%;
  }

  .title-container {
    color: white;

    font-family: Arial;
    font-weight: 800;
    text-align: center;
    font-size: 21px;
    margin-bottom: 25px;
  }

  .start-prompt {
    padding: 25px;
    background-color: rgb(68, 68, 68);
    width: fit-content;
    height: fit-content;

    border-radius: 25px;

    margin: auto;
  }
</style>
