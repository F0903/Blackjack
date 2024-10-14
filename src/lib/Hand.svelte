<script lang="ts">
  import Card from "./Card.svelte";
  import type { Card as CardModel } from "./models/Card.ts";

  export let hand_color: string;

  export let cards: CardModel[] = [];

  const CARD_LEFT_MARGIN = 30;
  const CARD_TOP_MARGIN = 20;

  let hand_elem: HTMLDivElement;
  let card_stack_elem: HTMLDivElement;

  function calcHandDimensions() {
    let first_card = card_stack_elem.firstChild as HTMLElement;
    if (!first_card) return;

    let width = first_card.clientWidth;
    let height = first_card.clientHeight;

    let child_count = card_stack_elem.childElementCount;
    let total_width = width + child_count * CARD_LEFT_MARGIN;
    let total_height = height + child_count * CARD_TOP_MARGIN;

    card_stack_elem.style.width = total_width + "px";
    card_stack_elem.style.height = total_height + "px";
  }

  $: if (hand_elem) {
    calcHandDimensions();
  }
</script>

<div
  class="player-hand"
  style="background-color: {hand_color};"
  bind:this={hand_elem}
>
  <div class="card-stack" bind:this={card_stack_elem}>
    {#each cards as card, index}
      <div
        class="card-container"
        style="left: {index * CARD_LEFT_MARGIN + 'px'}; top: {index *
          CARD_TOP_MARGIN +
          'px'};"
      >
        <Card rank={card.rank} suit={card.suit}></Card>
      </div>
    {/each}
  </div>

  <div class="label-container">
    <slot />
  </div>
</div>

<style>
  .card-stack {
    position: relative;
  }

  .player-hand {
    padding: 25px;
    width: fit-content;
    height: fit-content;

    border-radius: 25px;
  }

  .card-container {
    margin-left: 10px;
    margin-top: 10px;
    position: absolute;
  }
</style>
