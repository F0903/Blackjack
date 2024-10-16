import { CardModel } from "$lib/game/card/CardModel";
import { derived, get, writable } from "svelte/store";
import { GameEvent } from "./GameEvent";
import type { Writable } from "svelte/store";
import { Player } from "./Player";
import { HandModel } from "./HandModel";

export const onStart = new GameEvent();
export const onWon = new GameEvent();
export const onLost = new GameEvent();

export const dealer_hand: Writable<HandModel> = writable(new HandModel(0));
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
  bets += initial_bet;
  player.update((player) => {
    player.decreaseBalance(bets);
    return player;
  });

  // Dealer gets one face down and one face up to start.
  drawDealer(true);
  drawDealer(false);
  // Player gets two as well but face up.
  drawPlayer(false);
  drawPlayer(false);

  onStart.call();
}

function resetState() {
  player.update((player) => {
    player.removeExtraHands();
    player.clearAllCards();
    player.resetHands();
    split_available.set(false);
    return player;
  });

  dealer_hand.update((hand) => {
    hand.clearCards();
    return hand;
  });
}

function lostGame() {
  console.log("Game has been lost.");
  player.update((player) => {
    player.decreaseBalance(bets);
    player.persistChanges();
    return player;
  });

  resetState();
  onLost.call();
}

function wonGame() {
  console.log("Game won.");
  player.update((player) => {
    // Check each hand to see if has blackjack
    player.getHands().forEach((hand) => {
      const winnings =
        bets * (hand.isBlackjack() ? win_blackjack_multiplier : win_multiplier);
      player.increaseBalance(winnings);
    });

    // Write changes to DB
    player.persistChanges();
    return player;
  });

  resetState();
  onWon.call();
}

function drawCard(array: CardModel[], face_down: boolean) {
  let card = CardModel.getRandom(face_down);
  array.push(card);
}

function drawPlayer(face_down: boolean) {
  player.update((player) => {
    player.getHands().forEach((hand) => {
      // Don't draw cards to hands that are lost.
      if (hand.isLost()) return;
      let cards = hand.getCards();
      drawCard(cards, face_down);
    });
    return player;
  });
}

function drawDealer(face_down: boolean) {
  dealer_hand.update((hand) => {
    let cards = hand.getCards();
    drawCard(cards, face_down);
    return hand;
  });
}

async function advance_dealer() {
  let doneDrawing = false;

  // Check conditions on dealer cards.
  dealer_hand.update((hand) => {
    let cards = hand.getCards();

    cards[0].setFaceDown(false); // Flip the dealers first card at this point.

    let dealer_sum = hand.getValueSum();
    if (dealer_sum <= 16) {
      console.log("Dealer can draw.");
      drawCard(cards, false);
    } else if (dealer_sum > 21) {
      // If dealer sum is above 21 we can just call it a win early.
      wonGame();
    } else {
      console.log("Dealer is done drawing.");
      doneDrawing = true; // Dealer can draw no more cards.
      return hand;
    }

    return hand;
  });

  if (doneDrawing) {
    return;
  }

  // Short delay so it's less confusing when the dealer draws again.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return advance_dealer();
}

async function check_player() {
  let lostHandsCount = 0;
  // Check conditions on player cards.
  player.update((player) => {
    player.getHands().forEach((hand) => {
      if (hand.isBlackjack()) {
        hand.setWon(true);
        return hand;
      }

      let hand_sum = hand.getValueSum();
      if (hand_sum > 21) {
        hand.setLost(true); // The hand is over 21 and has been lost.
        console.log("hand has been lost");
        lostHandsCount += 1;
        return hand; // Exit early, no more to do here.
      }

      split_available.set(hand.canSplit());
    });

    return player;
  });

  console.log("Lost hands count = " + lostHandsCount);
  if (lostHandsCount == get(player_hands).length) {
    lostGame();
    return;
  }
}

async function advance() {
  check_player();
  advance_dealer();
}

export function split() {}

export async function hit() {
  drawPlayer(false);
  await advance();
}

export async function stand() {
  await advance();
}
