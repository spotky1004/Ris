import TickManager from "./TickManager.js";
export default class ChargeManager extends TickManager {
    constructor(options) {
        super(options);
    }
    tick() {
        this.timeLeft--;
        if (this.timeLeft <= 0)
            return true;
        return false;
    }
}
