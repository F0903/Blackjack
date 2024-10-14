export enum Suit {
  Hearts,
  Clubs,
  Diamonds,
  Spades,
}

export function suitToEmoji(suit: Suit): string {
  switch (suit) {
    case Suit.Clubs:
      return "♣️";
    case Suit.Hearts:
      return "♥️";
    case Suit.Spades:
      return "♠️";
    case Suit.Diamonds:
      return "♦️";
  }
}

export function suitToColor(suit: Suit): string {
  switch (suit) {
    case Suit.Spades:
    case Suit.Clubs:
      return "#262626";
    case Suit.Hearts:
    case Suit.Diamonds:
      return "#e63e3e";
  }
}
