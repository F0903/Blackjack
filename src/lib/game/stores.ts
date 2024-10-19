import { writable, type Writable } from "svelte/store";
import { Player } from "./Player";
import { Hand } from "./Hand";

export const dealer_hand: Writable<Hand> = writable(new Hand());
export const player: Writable<Player> = writable(await Player.get(0));

export const double_available = writable(false);
export const split_available = writable(false);

export const game_interactable = writable(false);
