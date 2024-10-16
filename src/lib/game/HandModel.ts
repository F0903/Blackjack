import type { CardModel } from "./card/CardModel";
import { Rank } from "./card/Rank";

export class HandModel {
  private handIndex: number;
  private cards: CardModel[] = [];

  private handIsLost: boolean = false;
  private handIsWon: boolean = false;

  constructor(handIndex: number) {
    this.handIndex = handIndex;
  }

  public canDraw() {
    return !this.handIsLost && !this.handIsWon;
  }

  public setWon(value: boolean) {
    this.handIsWon = value;
  }

  public isWon(): boolean {
    return this.handIsWon;
  }

  public setLost(value: boolean) {
    this.handIsLost = value;
  }

  public isLost(): boolean {
    return this.handIsLost;
  }

  public clearCards() {
    this.cards = [];
  }

  public getCards(): CardModel[] {
    return this.cards;
  }

  public getIndex(): number {
    return this.handIndex;
  }

  public canSplit(): boolean {
    if (this.cards.length != 2) return false;
    return this.cards[0].getHash() === this.cards[1].getHash();
  }

  public isBlackjack(): boolean {
    if (this.cards.length != 3) {
      return false;
    }

    let aceCount = 0;
    let namedCount = 0;
    this.cards.forEach((card) => {
      switch (card.getRank()) {
        case Rank.Ace:
          aceCount += 1;
          break;
        case Rank.Jack:
        case Rank.King:
        case Rank.Queen:
          namedCount += 1;
        default:
          break;
      }
    });

    return aceCount == 2 && namedCount == 1;
  }

  public getValueSum(): number {
    let total = 0;

    // Count the aces last or the value will be wrong if the ace is in the middle.
    let aces: CardModel[] = [];
    this.cards.forEach((card) => {
      if (card.getRank() === Rank.Ace) {
        aces.push(card);
        return;
      }
      total += card.getValue(total);
    });
    aces.forEach((ace) => {
      total += ace.getValue(total);
    });

    return total;
  }
}
