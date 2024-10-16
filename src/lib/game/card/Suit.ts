export enum Suit {
  Hearts,
  Clubs,
  Diamonds,
  Spades,
}

const suitEmojiIndex: string[] = ["♥️", "♣️", "♦️", "♠️"];

const suitColorIndex: string[] = [
  "var(--card-red)",
  "var(--card-black)",
  "var(--card-red)",
  "var(--card-black)",
];

export function suitToEmoji(suit: Suit): string {
  return suitEmojiIndex[suit];
}

export function suitToColor(suit: Suit): string {
  return suitColorIndex[suit];
}
