import type { Player } from "./Player";
import { player } from "./stores";

const win_multiplier = 2;
const win_blackjack_multiplier = 3;

export class BetPool {
  private bet: number = 0;

  public getCurrentBet(): number {
    return this.bet;
  }

  public increaseBet(by: number) {
    player.update((player) => {
      player.decreaseBalance(by);
      player.commitBalance();
      return player;
    });
    this.bet += by;
    console.log("increased bet to " + this.bet);
  }

  public doubleBet() {
    player.update((player) => {
      player.decreaseBalance(this.bet);
      return player;
    });
    this.bet *= 2;
    console.log("doubled bet to " + this.bet);
  }

  public returnBetsDirectly(player: Player) {
    player.increaseBalance(this.bet);
    player.commitBalance();
    console.log("returned " + this.bet + " to player");
  }

  public returnBets() {
    console.log("returning bets to player...");
    player.update((player) => {
      this.returnBetsDirectly(player);
      return player;
    });
    this.reset();
  }

  public payoutWinningsDirectly(blackjack: boolean, player: Player) {
    const multiplier = blackjack ? win_blackjack_multiplier : win_multiplier;
    const payout = this.bet * multiplier;
    player.increaseBalance(payout);
    player.commitBalance();
    console.log("paid " + payout + " to player");
  }

  public payoutWinnings(blackjack: boolean) {
    console.log("paying out winnings...");
    player.update((player) => {
      this.payoutWinningsDirectly(blackjack, player);
      return player;
    });
  }

  public reset() {
    this.bet = 0;
    console.log("reset bets to 0");
  }
}
