import WorkingStatusEffect from "./WorkingStatusEffect.js";
export default class StatusManager {
    constructor(game, parent, options = {}) {
        var _a, _b, _c, _d, _e, _f;
        this.game = game;
        this.parent = parent;
        this.maxHp = (_a = options.maxHp) !== null && _a !== void 0 ? _a : 0;
        this.hp = (_c = (_b = options.hp) !== null && _b !== void 0 ? _b : options.maxHp) !== null && _c !== void 0 ? _c : 0;
        this.baseDef = (_d = options.baseDef) !== null && _d !== void 0 ? _d : 0;
        this.baseTureDef = (_e = options.baseTureDef) !== null && _e !== void 0 ? _e : 0;
        this.baseAtk = (_f = options.baseAtk) !== null && _f !== void 0 ? _f : 0;
        this.effects = [];
    }
    addStatusEffect(statusEffect) {
        this.effects.push(new WorkingStatusEffect(this.game, this.parent, statusEffect));
    }
    getDef() {
        let def = this.baseDef;
        return def;
    }
    getTureDef() {
        let trueDef = this.baseTureDef;
        return trueDef;
    }
    /** Attack and returns dealt damage */
    attack(atk, type) {
        if (type === "normal") {
            atk *= (1 - this.getDef() / 10);
        }
        if (type === "normal" || type === "true") {
            atk *= (1 - this.getTureDef() / 10);
        }
        atk = Math.round(atk * 100) / 100;
        this.hp -= atk;
        return atk;
    }
}
