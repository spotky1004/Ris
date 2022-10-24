export default class TickManager {
    constructor(options) {
        var _a;
        this.type = options.type;
        this.length = (_a = options.length) !== null && _a !== void 0 ? _a : 1;
        this.timeLeft = length;
    }
    tick() {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
            this.timeLeft = this.length;
            return true;
        }
        return false;
    }
    allTick() {
        if (this.type !== "all")
            return false;
        return this.tick();
    }
    playerTick() {
        if (this.type !== "player")
            return false;
        return this.tick();
    }
    moveTick() {
        if (this.type !== "move")
            return false;
        return this.tick();
    }
}
