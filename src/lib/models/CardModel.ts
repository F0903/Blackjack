import { clamp } from "$lib/utils";
import { Rank } from "./Rank";
import { Suit } from "./Suit";

// Postfixed with "Model" to avoid confusion with the component.
export type CardModel = {
  suit: Suit;
  rank: Rank;
  face_down: boolean;
};

export function getCardValue(
  card: CardModel,
  current_hand_value: number
): number {
  switch (card.rank) {
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
      return card.rank;
    case Rank.Jack:
    case Rank.King:
    case Rank.Queen:
      return 10;
  }
}

export function getRandomCard(face_down: boolean): CardModel {
  const rank_max = 13 - 1; // there are 13 ranks (starts at 0)
  let rank: Rank = Math.round(Math.random() * rank_max);

  const suit_max = 4 - 1; // there are 4 suits (starts at 0)
  let suit: Suit = Math.round(Math.random() * suit_max);

  let card: CardModel = { face_down, rank, suit };
  console.log("random card: ", card);
  return card;
}
