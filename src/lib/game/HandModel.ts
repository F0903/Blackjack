import { CardModel } from "./card/CardModel";
import { Rank } from "./card/Rank";

export type HandState = "won" | "lost" | "push" | "in-play";

export class HandModel {
  private cards: CardModel[] = [];

  private handState: HandState = "in-play";

  public draw(face_down: boolean) {
    let card = CardModel.getRandom(face_down);
    this.cards.push(card);
  }

  public canDraw() {
    return this.handState == "in-play";
  }

  public setState(state: HandState) {
    this.handState = state;
  }

  public isWon(): boolean {
    return this.handState === "won";
  }

  public isLost(): boolean {
    return this.handState === "lost";
  }

  public clear() {
    this.cards = [];
    this.handState = "in-play";
  }

  public getCards(): CardModel[] {
    return this.cards;
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

  public higherThan(other: HandModel): boolean {
    let my_val = this.getValueSum();
    let other_val = other.getValueSum();
    return my_val > other_val;
  }

  public equal(other: HandModel): boolean {
    let my_val = this.getValueSum();
    let other_val = other.getValueSum();
    return my_val === other_val;
  }

  public getColor(default_value: string): string {
    switch (this.handState) {
      case "won":
        console.log("color won");
        return "green";
      case "lost":
        console.log("color lost");
        return "red";
      case "push":
        console.log("color push");
        return "yellow";
      default:
        return default_value;
    }
  }
}
