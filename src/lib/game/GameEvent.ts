type GameEventFn = () => void;

export class GameEvent<Fn = GameEventFn> {
  private subscribers: GameEventFn[] = [];

  public sub(fn: GameEventFn) {
    this.subscribers.push(fn);
  }

  public call() {
    this.subscribers.forEach((fn) => fn());
  }
}
