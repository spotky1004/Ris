type TickTypes = "move" | "player" | "all";

export interface TickManagerOptions {
  type: TickTypes;
  length?: number;
}

export default class TickManager {
  type: TickTypes;
  length: number;
  timeLeft: number;

  constructor(options: TickManagerOptions) {
    this.type = options.type;
    this.length = options.length ?? 1;
    this.timeLeft = length;
  }

  private tick() {
    this.timeLeft--;
    if (this.timeLeft <= 0) {
      this.timeLeft = this.length;
      return true;
    }
    return false;
  }

  allTick() {
    if (this.type !== "all") return false;
    return this.tick();
  }

  playerTick() {
    if (this.type !== "player") return false;
    return this.tick();
  }

  moveTick() {
    if (this.type !== "move") return false;
    return this.tick();
  }
}
