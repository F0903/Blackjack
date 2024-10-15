<script lang="ts">
  import { rankToString, type Rank } from "$lib/models/Rank";
  import { Suit, suitToColor, suitToEmoji } from "$lib/models/Suit";

  export let upsidedown: boolean = false;
  export let suit: Suit;
  export let rank: Rank;
</script>

<div class="symbols-container" class:upsidedown>
  <span class="rank" style="color: {suitToColor(suit)}"
    >{rankToString(rank)}</span
  >
  <span class="suit" style="color: {suitToColor(suit)}">
    {suitToEmoji(suit)}
  </span>
</div>

<style>
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
</style>
