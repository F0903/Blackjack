import { get } from "svelte/store";
import { GameEvent } from "./GameEvent";
import { sleep } from "$lib/utils";
import {
  dealer_hand,
  double_available,
  game_interactable,
  player,
  split_available,
} from "./stores";

export const onStart = new GameEvent();
export const onEnd = new GameEvent();

export async function start(initialBet: number) {
  console.log("starting game... initial bet: " + initialBet);
  onStart.call();

  drawInitialCards(initialBet);
  double_available.set(true);
  game_interactable.set(true);
}

async function end() {
  game_interactable.set(false);
  await sleep(2000);
  resetState();
  onEnd.call();
}

async function drawInitialCards(initialBet: number) {
  let blackjack: boolean = false;

  dealer_hand.update((dealer_hand) => {
    player.update((player) => {
      player.assertHand(); // See comment in method for call reason.

      // Dealer gets one face down and one face up to start.
      dealer_hand.draw(true);
      dealer_hand.draw(false);

      let player_hand = player.getCurrentHand();
      // Player gets two as well but face up.
      player_hand.draw(false);
      player_hand.draw(false);
      player_hand.bet(initialBet);
      player_hand.select();

      split_available.set(player_hand.canSplit());

      // Check for blackjack combinations
      if (player_hand.isBlackjack() && dealer_hand.isBlackjack()) {
        console.log("both player and dealer had blackjack");
        player_hand.push();
        blackjack = true;
      } else if (player_hand.isBlackjack()) {
        console.log("player had blackjack");
        player_hand.win();
        blackjack = true;
      } else if (dealer_hand.isBlackjack()) {
        console.log("dealer had blackjack");
        dealer_hand.win();
        player_hand.lost();
        blackjack = true;
      }

      return player;
    });
    return dealer_hand;
  });

  if (blackjack) return end();
}

function resetState() {
  console.log("resetting state...");
  player.update((player) => {
    player.reset();
    return player;
  });

  dealer_hand.update((hand) => {
    hand.clear();
    return hand;
  });

  split_available.set(false);
}

async function winAll() {
  console.log("player wins all hands");
  player.update((player) => {
    player.getHands().forEach((hand) => {
      hand.win();
    });
    return player;
  });

  return end();
}

// Returns if true if the dealer went bust.
async function advanceDealer(): Promise<boolean> {
  let dealerState: "bust" | "stand" | "drawing" = "drawing";

  game_interactable.set(false);

  // Check conditions on dealer cards.
  dealer_hand.update((hand) => {
    let cards = hand.getCards();

    cards[0].setFaceDown(false); // Flip the dealers first card at this point.

    let dealer_sum = hand.getValueSum();
    if (dealer_sum <= 16) {
      console.log("dealer is drawing...");
      hand.draw(false);
      dealerState = "drawing";
    }

    // We check dealer_sum again after drawing above.
    if (dealer_sum > 21) {
      hand.lost();
      dealerState = "bust";
    } else if (dealer_sum > 16) {
      console.log("dealer is standing...");
      dealerState = "stand"; // Dealer can draw no more cards.
    }
    return hand;
  });

  console.log("checking dealer state... | " + dealerState);
  //NOTE: typescript can not see that dealerState is modified in callback above.
  switch (dealerState) {
    //@ts-ignore
    case "bust":
      await winAll();
      return true;
    //@ts-ignore
    case "stand":
      game_interactable.set(true);
      return false;
    //@ts-ignore
    case "drawing":
      await sleep(1000);
      return advanceDealer();
  }
}

async function resolveHand() {
  // We aren't gonna modify the dealer hand, so we can use get() instead of update()
  let dealerHand = get(dealer_hand);

  let endGame = false;

  player.update((player) => {
    let hand = player.getCurrentHand();

    if (hand.higherThan(dealerHand)) {
      console.log("hand won");
      hand.win();
    } else if (hand.equal(dealerHand)) {
      console.log("hand drew");
      hand.push();
    } else {
      console.log("hand lost");
      hand.lost();
    }

    if (player.areAllHandsDone()) endGame = true;
    if (player.hasOtherHands()) {
      let newHand = player.selectNextHand();
      split_available.set(newHand.canSplit());
      double_available.set(true);
    }
    return player;
  });

  if (endGame) await end();
}

export async function double() {
  //TODO: check this works with split hands.
  split_available.set(false);
  double_available.set(false);

  player.update((player) => {
    player.getCurrentHand().doubleDown();
    return player;
  });

  const bust = await hit();
  if (bust) return;

  await stand();
}

export function split() {
  player.update((player) => {
    player.splitHand();
    let newHand = player.getCurrentHand();
    split_available.set(newHand.canSplit());
    return player;
  });
}

export async function hit(): Promise<boolean> {
  let allBust = false;

  split_available.set(false);
  double_available.set(false);

  player.update((player) => {
    let hand = player.getCurrentHand();

    hand.draw(false);

    let hand_sum = hand.getValueSum();
    if (hand_sum > 21) {
      hand.lost();
      if (player.hasOtherHands()) {
        player.selectNextHand();
        split_available.set(hand.canSplit());
        double_available.set(true);
      } else {
        hand.lost();
        allBust = true;
      }
      return player;
    }

    return player;
  });

  if (allBust) await end();

  return allBust;
}

export async function stand() {
  split_available.set(false);
  double_available.set(false);

  const bust = await advanceDealer();
  if (bust) return;
  resolveHand();
}
