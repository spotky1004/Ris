export default class Item {
    constructor(options) {
        var _a, _b, _c, _d;
        this.name = options.name;
        this.unlockedDefault = (_a = options.unlockedDefault) !== null && _a !== void 0 ? _a : true;
        this.madeFrom = options.madeFrom;
        this.on = options.on;
        this.chargeOptions = (_b = options.chargeOptions) !== null && _b !== void 0 ? _b : null;
        this.destroyOnEmit = (_c = options.destroyOnEmit) !== null && _c !== void 0 ? _c : false;
        this.onEmit = options.onEmit;
        let tier = (_d = options.tier) !== null && _d !== void 0 ? _d : 1;
        if (Array.isArray(this.madeFrom)) {
            tier = Math.max(...this.madeFrom.map(item => item.tier)) + 1;
        }
        this.tier = tier;
    }
}
