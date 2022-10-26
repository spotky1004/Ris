export default class TickManager {
    constructor(options) {
        var _a;
        this.type = options.type;
        this.length = (_a = options.length) !== null && _a !== void 0 ? _a : 1;
        this.timeLeft = length;
    }
    tick(type) {
        if (type !== this.type)
            return false;
        this.timeLeft--;
        if (this.timeLeft <= 0) {
            return true;
        }
        return false;
    }
    restart() {
        this.timeLeft = this.length;
    }
}
