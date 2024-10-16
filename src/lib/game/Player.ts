import type { CardModel } from "$lib/game/card/CardModel";
import { invoke } from "@tauri-apps/api/core";
import { HandModel } from "./HandModel";

export class Player {
  private id: number;
  private balance: number;

  private hands: HandModel[] = [new HandModel()];
  private currentHandIndex: number = 0;

  constructor(id: number, balance: number) {
    this.id = id;
    this.balance = balance;
  }

  public decreaseBalance(sub: number) {
    this.balance -= sub;
  }

  public increaseBalance(add: number) {
    this.balance += add;
  }

  public getBalance(): number {
    return this.balance;
  }

  public getCards(handIndex: number): CardModel[] {
    let hand = this.hands[handIndex];
    return hand.getCards();
  }

  public getHands(): HandModel[] {
    return this.hands;
  }

  public getCurrentHand(): HandModel {
    return this.hands[this.currentHandIndex];
  }

  public hasOtherHands(): boolean {
    return this.hands.length > 1;
  }

  public swapNextHand() {
    this.currentHandIndex += 1;
  }

  public reset() {
    this.hands.splice(1); // Remove all other hands
    this.getCurrentHand().clear();
    this.currentHandIndex = 0;
  }

  public async persistChanges() {
    await invoke("player_update_balance", {
      playerId: this.id,
      newBal: this.balance,
    });
  }

  public static async get(id: number): Promise<Player> {
    let bal: number = await invoke("player_get_balance", { playerId: id });
    let player = new Player(id, bal);
    return player;
  }
}
