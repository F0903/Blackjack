<script lang="ts">
  import type { CardRank } from "./models/Card";
  import { suitToColor, suitToEmoji, type Suit } from "./models/Suit";

  export let suit: Suit;
  export let rank: CardRank;
</script>

<div class="card">
  <div class="upper-part">
    <div class="symbols-container">
      <span class="rank" style="color: {suitToColor(suit)}">{rank}</span>
      <span class="suit" style="color: {suitToColor(suit)}">
        {suitToEmoji(suit)}
      </span>
    </div>
  </div>
  <div class="middle-part"></div>
  <div class="lower-part">
    <div class="symbols-container upsidedown">
      <span class="rank" style="color: {suitToColor(suit)}">{rank}</span>
      <span class="suit" style="color: {suitToColor(suit)}">
        {suitToEmoji(suit)}
      </span>
    </div>
  </div>
</div>

<style>
  .upper-part {
    margin-bottom: auto;
    margin-right: auto;
  }

  .lower-part {
    margin-top: auto;
    margin-left: auto;
  }

  .upsidedown {
    rotate: 180deg;
  }

  .suit {
    margin-top: -4px;
  }

  .symbols-container {
    display: flex;
    flex-direction: column;
  }

  .card {
    width: 10vh;
    aspect-ratio: 0.714;
    background-color: white;
    margin: 10px;
    padding: 10px;

    border-radius: 10px;

    font-family: "sans-serif";
    font-weight: 1000;
    font-size: min(26px, 170%);

    display: flex;
    flex-direction: column;

    box-shadow: -5px -5px 20px 1px rgba(40, 40, 41, 0.25);
  }
</style>
