import TickManager, { TickManagerOptions, TickTypes } from "./TickManager.js";

export default class ChargeManager extends TickManager {
  constructor(options: TickManagerOptions) {
    super(options);
  }

  tick(type: TickTypes) {
    if (type !== this.type) return false;
    
    this.timeLeft--;
    if (this.timeLeft <= 0) return true;
    return false;
  }
}
