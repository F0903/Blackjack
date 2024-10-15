<script lang="ts">
  import { onMount, tick } from "svelte";
  import Card from "./Card/Card.svelte";
  import { getCardValue, type CardModel } from "./models/CardModel";
  import { Rank } from "./models/Rank";

  export let label: string;
  export let hand_color: string;
  export let cards: CardModel[] = [];

  const CARD_LEFT_MARGIN = 30;
  const CARD_TOP_MARGIN = 20;

  let hand_elem: HTMLDivElement;
  let card_stack_elem: HTMLDivElement;

  let hand_value: number = 0;

  function calcHandValue() {
    let total = 0;

    console.log(cards);

    // Count the aces last or the value will be wrong if the ace is in the middle.
    let aces: CardModel[] = [];
    cards.forEach((card) => {
      if (card.rank === Rank.Ace) {
        aces.push(card);
        return;
      }
      total += getCardValue(card, hand_value + total);
    });
    aces.forEach((ace) => {
      total += getCardValue(ace, hand_value + total);
    });

    hand_value = total;
  }

  function calcHandDimensions() {
    let first_card = card_stack_elem.children[0];
    if (!first_card) return;
    console.log("debug 2");

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

  async function onNewCard() {
    await tick(); // We need to wait to the DOM changes to happen before going further.
    calcHandDimensions();
    calcHandValue();
  }

  $: if (cards.length > 0) {
    onNewCard();
  }
</script>

<div
  class="player-hand"
  style="background-color: {hand_color};"
  bind:this={hand_elem}
>
  <div class="label-container">
    <span>{label}</span>
  </div>
  <div class="card-stack" bind:this={card_stack_elem}>
    {#each cards as card, index}
      <div
        class="card-container"
        style="left: {index * CARD_LEFT_MARGIN + 'px'}; top: {index *
          CARD_TOP_MARGIN +
          'px'};"
      >
        <Card rank={card.rank} suit={card.suit} face_down={card.face_down} />
      </div>
    {/each}
  </div>
  <div class="value-container">
    <span>{hand_value}</span>
  </div>
</div>

<style>
  .value-container {
    color: white;
    font-weight: 800;
  }

  .label-container {
    color: white;
    font-family: Arial;
  }

  .card-stack {
    position: relative;
  }

  .player-hand {
    padding: 25px;
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
    margin-left: 15px;
  }
</style>
