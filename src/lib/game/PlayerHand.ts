import { BetPool } from "./BetPool";
import { HandModel } from "./HandModel";

export class PlayerHand extends HandModel {
  private bets: BetPool = new BetPool();

  private doubledDown: boolean = false;

  public doubleDown() {
    this.doubledDown = true;
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
    const newHand = new PlayerHand(cards);
    newHand.bet(this.bets.getCurrentBet());
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
    this.doubledDown = false;
    this.bets.reset();
  }
}
