<script lang="ts">
  import { Rank } from "$lib/game/card/Rank";
  import type { Suit } from "$lib/game/card/Suit";
  import CardBack from "./CardBack.svelte";
  import CardSymbols from "./CardSymbols.svelte";

  export let suit: Suit;
  export let rank: Rank;
  export let face_down: boolean = false;
</script>

<div class="card">
  {#if !face_down}
    <div class="upper-part">
      <CardSymbols {suit} {rank} />
    </div>
    <div class="middle-part"></div>
    <div class="lower-part">
      <CardSymbols {suit} {rank} upsidedown={true} />
    </div>
  {:else}
    <CardBack />
  {/if}
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

  .card {
    --card-red: #e63e3e;
    --card-black: #262626;

    --card-border-radius: 10px;

    width: 60px;
    aspect-ratio: 0.714;
    background-color: white;
    margin: 10px;
    padding: 10px;

    border-radius: var(--card-border-radius);

    font-family: "sans-serif";
    font-weight: 1000;
    font-size: min(26px, 170%);

    display: flex;
    flex-direction: column;

    box-shadow: -5px -5px 20px 1px rgba(40, 40, 41, 0.25);
  }
</style>
