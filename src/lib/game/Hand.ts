import { Card as Card } from "./card/Card";
import { Rank } from "./card/Rank";

export class Hand {
  protected cards: Card[];

  private handState: "won" | "lost" | "push" | "in-play" = "in-play";

  constructor(initCards: Card[] = []) {
    this.cards = initCards;
  }

  public draw(face_down: boolean) {
    let card = Card.getRandom(face_down);
    this.cards.push(card);
  }

  public canDraw() {
    return this.handState == "in-play";
  }

  public win() {
    // We could check for blackjack here but when this is called
    // it would already have been decided, so we just take it as a parameter
    this.handState = "won";
  }

  public lost() {
    this.handState = "lost";
  }

  public push() {
    this.handState = "push";
  }

  public inPlay(): boolean {
    return this.handState === "in-play";
  }

  public clear() {
    this.cards = [];
    this.handState = "in-play";
  }

  public getCards(): Card[] {
    return this.cards;
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

  public getValueSum(ignoreHiddenCards: boolean = false): number {
    let total = 0;

    // Count the aces last or the value will be wrong if the ace is in the middle.
    let aces: Card[] = [];
    this.cards.forEach((card) => {
      if (card.isFaceDown() && ignoreHiddenCards) return; // Don't count hidden cards

      if (card.getRank() === Rank.Ace) {
        aces.push(card);
        return;
      }
      total += card.getValue(total);
    });
    aces.forEach((ace) => {
      // We don't need to do the hidden check here as the ace isn't added if its hidden.
      total += ace.getValue(total);
    });

    return total;
  }

  public higherThan(other: Hand): boolean {
    let my_val = this.getValueSum();
    let other_val = other.getValueSum();
    return my_val > other_val;
  }

  public equal(other: Hand): boolean {
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
