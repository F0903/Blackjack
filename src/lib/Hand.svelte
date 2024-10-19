<script lang="ts">
  import { tick } from "svelte";
  import Card from "./Card/Card.svelte";
  import type { Hand } from "./game/Hand";
  import { PlayerHand } from "./game/PlayerHand";

  export let label: string;
  export let hand_color: string;
  export let hand: Hand;

  const CARD_LEFT_MARGIN = 30;
  const CARD_TOP_MARGIN = 5;

  let card_stack_elem: HTMLDivElement;

  function calcHandDimensions() {
    console.log("Calculating hand dimensions...");
    let first_card = card_stack_elem.children[0];
    if (!first_card) {
      card_stack_elem.style.width = 0 + "px";
      card_stack_elem.style.height = 0 + "px";
      return;
    }

    // Get dimensions of card.
    let width = first_card.clientWidth;
    let height = first_card.clientHeight;

    // The total size will be dimension + child_count * margin
    // since all cards are stacked on each other from the start
    // the only extra width will be the offset of each child from
    // the beginning (the margin)
    let child_count = card_stack_elem.childElementCount;
    let total_width = width + child_count * CARD_LEFT_MARGIN;
    let total_height = height + child_count * CARD_TOP_MARGIN;

    // Now set the card stack dimensions to the total dimensions of the cards combined.
    card_stack_elem.style.width = total_width + "px";
    card_stack_elem.style.height = total_height + "px";
  }

  async function onHandChanged() {
    await tick(); // We need to wait to the DOM changes to happen before going further.
    calcHandDimensions();
  }

  $: if (hand) {
    onHandChanged();
  }
</script>

<div
  class="hand"
  class:selected={hand instanceof PlayerHand ? hand.isSelected() : false}
  style="background-color: {hand.getColor(hand_color)};"
>
  <div class="label-container">
    <span>{label}</span>
  </div>
  <div class="card-stack" bind:this={card_stack_elem}>
    {#each hand.getCards() as card, index}
      <div
        class="card-container"
        style="left: {index * CARD_LEFT_MARGIN + 'px'}; top: {index *
          CARD_TOP_MARGIN +
          'px'};"
      >
        <Card
          rank={card.getRank()}
          suit={card.getSuit()}
          face_down={card.isFaceDown()}
        />
      </div>
    {/each}
  </div>
  <div class="value-container">
    <span>{hand.getValueSum(true)}</span>
  </div>
</div>

<style>
  .selected {
    outline: var(--highlight-color) solid 5px;
  }

  .value-container {
    color: var(--primary-text-color);
    font-weight: 800;
  }

  .label-container {
    color: var(--primary-text-color);
    font-family: Arial;
  }

  .card-stack {
    position: relative;
    margin-left: 25px;
  }

  .hand {
    padding: 15px;
    width: fit-content;
    height: fit-content;

    border-radius: 25px;

    min-height: 200px;
    min-width: 100px;

    display: flex;
    flex-direction: column;
    place-content: space-between;
  }

  .card-container {
    position: absolute;
  }
</style>
