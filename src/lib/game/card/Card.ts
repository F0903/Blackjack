import { Rank } from "./Rank";
import { Suit } from "./Suit";

export class Card {
  private suit: Suit;
  private rank: Rank;
  private face_down: boolean;

  constructor(suit: Suit, rank: Rank, face_down: boolean) {
    this.suit = suit;
    this.rank = rank;
    this.face_down = face_down;
  }

  public getSuit(): Suit {
    return this.suit;
  }

  public getRank(): Rank {
    return this.rank;
  }

  public isFaceDown(): boolean {
    return this.face_down;
  }

  public flip() {
    this.face_down = !this.face_down;
  }

  public setFaceDown(value: boolean) {
    this.face_down = value;
  }

  public getValue(current_hand_value: number): number {
    switch (this.rank) {
      case Rank.Ace:
        return current_hand_value <= 10 ? 11 : 1;
      case Rank.Two:
      case Rank.Three:
      case Rank.Four:
      case Rank.Five:
      case Rank.Six:
      case Rank.Seven:
      case Rank.Eight:
      case Rank.Nine:
      case Rank.Ten:
        return this.rank + 1; // Enums start at 0, so we have to add 1.
      case Rank.Jack:
      case Rank.Queen:
      case Rank.King:
        return 10;
    }
  }

  public static getRandom(face_down: boolean): Card {
    const rank_max = 13 - 1; // there are 13 ranks (starts at 0)
    let rank: Rank = Math.round(Math.random() * rank_max);

    const suit_max = 4 - 1; // there are 4 suits (starts at 0)
    let suit: Suit = Math.round(Math.random() * suit_max);

    let card = new Card(suit, rank, face_down);
    return card;
  }
}
