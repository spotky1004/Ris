import ChargeManager from "../etc/ChargeManager.js";
export default class WorkingItem {
    constructor(game, owner, item) {
        var _a;
        this.game = game;
        this.owner = owner;
        this.on = item.on;
        this.item = item;
        this.chargeTick = new ChargeManager((_a = item.chargeOptions) !== null && _a !== void 0 ? _a : {
            type: "all",
            length: 0
        });
    }
    tick(type) {
        this.tick(type);
    }
    emit(event, data) {
        const { game, owner, on, item } = this;
        if (
        // @ts-ignore 'E' and 'T' have no overlap...
        event === on &&
            this.chargeTick.timeLeft <= 0) {
            // @ts-ignore why??
            const result = item.onEmit({ game, owner, event, data });
            return result;
        }
        return;
    }
}
