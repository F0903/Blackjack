import { getRandomCard, type CardModel } from "$lib/models/CardModel";
import { Rank } from "$lib/models/Rank";
import { Suit } from "$lib/models/Suit";
import { writable } from "svelte/store";
import { GameEvent } from "./GameEvent";
import type { Writable } from "svelte/store";

export const onWin = new GameEvent();
export const onLoss = new GameEvent();

export const dealer_cards: Writable<CardModel[]> = writable([]);
export const player_cards: Writable<CardModel[]> = writable([]);

export const player_balance: Writable<number> = writable(1000);

let round: number = 0;

function start() {
  round += 1;
}

function draw_player(face_down: boolean) {
  let card = getRandomCard(face_down);
  player_cards.update((items) => {
    items.push(card);
    return items;
  });
}

function draw_dealer(face_down: boolean) {
  let card = getRandomCard(face_down);
  dealer_cards.update((items) => {
    items.push(card);
    return items;
  });
}

export function hit() {
  draw_player(false);
}
