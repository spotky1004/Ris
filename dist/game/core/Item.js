export default class Item {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.name = options.name;
        this.unlockedDefault = (_a = options.unlockedDefault) !== null && _a !== void 0 ? _a : true;
        this.recipe = (_b = options.recipe) !== null && _b !== void 0 ? _b : [];
        this.shopable = (_c = options.shopable) !== null && _c !== void 0 ? _c : false;
        this.on = options.on;
        this.timing = options.timing;
        this.chargeOptions = (_d = options.chargeOptions) !== null && _d !== void 0 ? _d : null;
        this.destroyOnEmit = (_e = options.destroyOnEmit) !== null && _e !== void 0 ? _e : false;
        this.onEmit = options.onEmit;
        this.statusChanges = new Map(Object.entries((_f = options.statusChanges) !== null && _f !== void 0 ? _f : {}));
        let tier = (_g = options.tier) !== null && _g !== void 0 ? _g : 1;
        let cost = (_h = options.cost) !== null && _h !== void 0 ? _h : 0;
        if (this.recipe.length > 0) {
            tier = Math.max(...this.recipe.map(item => item.tier)) + 1;
            cost = this.recipe.reduce((a, b) => a + b.cost, 0);
        }
        this.tier = tier;
        this.cost = cost;
    }
}
