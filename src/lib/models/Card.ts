import type { Suit } from "./Suit";

export type CardRank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export type Card = {
    suit: Suit,
    rank: CardRank
}