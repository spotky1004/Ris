export type TickTypes = "move" | "playerTurn" | "allTurn";

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
    this.timeLeft = this.length;
  }

  tick(type: TickTypes) {
    if (type !== this.type) return false;
    
    this.timeLeft--;
    if (this.timeLeft <= 0) return true;
    return false;
  }

  isReady() {
    return this.timeLeft <= 0;
  }

  restart() {
    this.timeLeft = this.length;
  }
}
