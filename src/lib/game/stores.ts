import { writable, type Writable } from "svelte/store";
import { Player } from "./Player";
import { HandModel } from "./HandModel";

export const dealer_hand: Writable<HandModel> = writable(new HandModel());
export const player: Writable<Player> = writable(await Player.get(0));

export const double_available = writable(false);
export const split_available = writable(false);

export const game_interactable = writable(false);
