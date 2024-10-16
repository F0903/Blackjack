import { derived, get, writable } from "svelte/store";
import { GameEvent } from "./GameEvent";
import type { Writable } from "svelte/store";
import { Player } from "./Player";
import { HandModel } from "./HandModel";
import { sleep } from "$lib/utils";

export const onStart = new GameEvent();
export const onGameEnd = new GameEvent();

export const dealer_hand: Writable<HandModel> = writable(new HandModel());
export const dealer_cards = derived(dealer_hand, (hand) => hand.getCards());

// The hardcoded id of 0 is a little hack for now.
// move player_cards into this at some point.
export const player: Writable<Player> = writable(await Player.get(0));
export const player_hands = derived(player, (player) => player.getHands());
export const player_balance = derived(player, (player) => player.getBalance());

export const split_available = writable(false);

//TODO: refactor

const win_multiplier = 2;
const win_blackjack_multiplier = 3;

let bets: number = 0;

export async function startGame(initial_bet: number) {
  console.log("starting game... initial bet: " + initial_bet);
  onStart.call();

  bets += initial_bet;
  player.update((player) => {
    player.decreaseBalance(bets);
    return player;
  });

  dealer_hand.update((dealer_hand) => {
    player.update((player) => {
      // Dealer gets one face down and one face up to start.
      dealer_hand.draw(true);
      dealer_hand.draw(false);

      let player_hand = player.getCurrentHand();
      // Player gets two as well but face up.
      player_hand.draw(false);
      player_hand.draw(false);

      // Check for blackjack combinations
      if (player_hand.isBlackjack() && dealer_hand.isBlackjack()) {
        player_hand.setState("push");
        drawAll();
      } else if (player_hand.isBlackjack()) {
        player_hand.setState("won");
        winAll();
      } else if (dealer_hand.isBlackjack()) {
        dealer_hand.setState("won");
        loseAll();
      }

      return player;
    });
    return dealer_hand;
  });
}

function resetState() {
  player.update((player) => {
    player.reset();
    return player;
  });

  dealer_hand.update((hand) => {
    hand.clear();
    return hand;
  });

  split_available.set(false);
  bets = 0;
}

function calcWinnings(hand: HandModel): number {
  return (
    bets * (hand.isBlackjack() ? win_blackjack_multiplier : win_multiplier)
  );
}

async function endGame() {
  await sleep(2000);
  resetState();
  onGameEnd.call();
}

async function loseAll() {
  console.log("Every hand has been lost.");
  player.update((player) => {
    // The bets have already been withdrawn, so we just need to persist them.
    player.persistChanges();
    return player;
  });

  await endGame();
}

async function drawAll() {
  console.log("Every hand has been drew.");
  player.update((player) => {
    player.increaseBalance(bets); // Give back the bets.
    player.persistChanges();
    return player;
  });

  await endGame();
}

async function winAll() {
  console.log("Every hand has been won.");
  player.update((player) => {
    player.getHands().forEach((hand) => {
      hand.setState("won");
      player.increaseBalance(calcWinnings(hand));
    });

    // Write changes to DB
    player.persistChanges();
    return player;
  });

  await endGame();
}

async function advanceDealer() {
  let dealerState: "lost" | "stand" | "drawing" = "drawing";

  // Check conditions on dealer cards.
  dealer_hand.update((hand) => {
    let cards = hand.getCards();

    cards[0].setFaceDown(false); // Flip the dealers first card at this point.

    let dealer_sum = hand.getValueSum();
    if (dealer_sum <= 16) {
      console.log("Dealer can draw.");
      hand.draw(false);
      dealerState = "drawing";
    } else if (dealer_sum > 21) {
      hand.setState("lost");
      dealerState = "lost";
    } else {
      console.log(cards);
      dealerState = "stand"; // Dealer can draw no more cards.
    }
    return hand;
  });

  console.log("checking dealer state...");
  //NOTE: typescript can not see that dealerState is modified in callback above.
  switch (dealerState) {
    //@ts-ignore
    case "lost":
      return winAll(); // Remember if the dealer wins, that means we lose ;)
    //@ts-ignore
    case "stand":
      return;
    //@ts-ignore
    case "drawing":
      await sleep(1000);
      return advanceDealer();
  }
}

async function resolveHand() {
  // We aren't gonna modify the dealer hand, so we can use get() instead of update()
  let deal_hand = get(dealer_hand);

  let end_game = false;

  player.update((player) => {
    let player_hand = player.getCurrentHand();

    if (player_hand.higherThan(deal_hand)) {
      console.log("hand won");
      player_hand.setState("won");
      player.increaseBalance(calcWinnings(player_hand));
    } else if (player_hand.equal(deal_hand)) {
      console.log("hand drew");
      player_hand.setState("push");
      player.increaseBalance(bets);
    } else {
      console.log("hand lost");
      player_hand.setState("lost");
    }

    if (player.hasOtherHands()) player.swapNextHand();
    else end_game = true;

    player.persistChanges();

    return player;
  });

  if (end_game) await endGame();
}

export function split() {
  //TODO
}

export function hit() {
  let bust = false;

  player.update((player) => {
    let hand = player.getCurrentHand();

    hand.draw(false);

    let hand_sum = hand.getValueSum();
    if (hand_sum > 21) {
      hand.setState("lost");
      if (player.hasOtherHands()) {
        player.swapNextHand();
      } else {
        bust = true;
      }
      return player;
    }

    split_available.set(hand.canSplit());

    return player;
  });

  if (bust) loseAll();
}

export async function stand() {
  await advanceDealer();
  resolveHand();
}
