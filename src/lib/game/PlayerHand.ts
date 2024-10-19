import { BetPool } from "./BetPool";
import { Card } from "./card/Card";
import { Hand } from "./Hand";

export class PlayerHand extends Hand {
  private bets: BetPool = new BetPool();

  private selected: boolean;

  constructor(selected: boolean = false, initCards: Card[] = []) {
    super(initCards);
    this.selected = selected;
  }

  public isSelected(): boolean {
    return this.selected;
  }

  public select() {
    this.selected = true;
  }

  public deselect() {
    this.selected = false;
  }

  public doubleDown() {
    this.bets.doubleBet();
  }

  public bet(amount: number) {
    this.bets.increaseBet(amount);
  }

  public canSplit(): boolean {
    if (this.cards.length != 2) return false;
    return this.cards[0].getValue(0) === this.cards[1].getValue(0);
  }

  public split(): PlayerHand {
    const cards = this.cards.splice(1);

    const newHand = new PlayerHand(false, cards);
    newHand.bet(this.bets.getCurrentBet());
    newHand.draw(false);

    this.draw(false);
    return newHand;
  }

  public override win(): void {
    super.win();
    const isBlackjack = this.isBlackjack();
    this.bets.payoutWinnings(isBlackjack);
  }

  public override push(): void {
    super.push();
    this.bets.returnBets();
  }

  public override clear(): void {
    super.clear();
    this.bets.reset();
  }
}
