export class GameEvent<Fn extends Function = () => void> {
  private subscribers: Set<Fn> = new Set();

  public sub(fn: Fn) {
    console.log("adding subscriber to game event");
    this.subscribers.add(fn);
  }

  public unsub(fn: Fn) {
    this.subscribers.delete(fn);
  }

  public call() {
    this.subscribers.forEach((fn) => fn());
  }
}
