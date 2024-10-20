import type { Card } from "$lib/game/card/Card";
import { invoke } from "@tauri-apps/api/core";
import { Hand } from "./Hand";
import { PlayerHand } from "./PlayerHand";

export class Player {
  private id: number;
  private balance: number;

  private hands: PlayerHand[] = [];
  private currentHandIndex: number = 0;

  constructor(id: number, balance: number) {
    this.id = id;
    this.balance = balance;
  }

  public assertHand() {
    this.hands = [new PlayerHand(true)];
  }

  public reset() {
    this.currentHandIndex = 0;
    this.hands = [];
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

  public getCards(handIndex: number): Card[] {
    let hand = this.hands[handIndex];
    return hand.getCards();
  }

  public getHands(): Hand[] {
    return this.hands;
  }

  public getCurrentHand(): PlayerHand {
    console.log("Getting current hand with index = " + this.currentHandIndex);
    return this.hands[this.currentHandIndex];
  }

  // Does the player have other hands after the one he is holding?
  public hasOtherHands(): boolean {
    return this.hands.length > this.currentHandIndex + 1;
  }

  public hasMultipleHands(): boolean {
    return this.hands.length > 1;
  }

  public areAllHandsDone(): boolean {
    let doneCount = 0;
    this.hands.forEach((hand) => {
      if (hand.inPlay()) return;

      console.log("Hand is done.");
      doneCount += 1;
    });

    console.log("Hand done count = " + doneCount);
    console.log("hands count = " + this.hands.length);
    return doneCount === this.hands.length;
  }

  public selectNextHand(): PlayerHand {
    this.getCurrentHand().deselect();

    this.currentHandIndex += 1;
    console.log("swapping hand, new index: " + this.currentHandIndex);

    let newHand = this.getCurrentHand();
    newHand.select();

    return newHand;
  }

  public splitHand() {
    let hand = this.getCurrentHand();
    let newHand = hand.split();
    this.hands.push(newHand);
  }

  public async commitBalance() {
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
