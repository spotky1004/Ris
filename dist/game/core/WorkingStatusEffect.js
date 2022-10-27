import TickManager from "../util/TickManager.js";
export default class WorkingStatusEffect {
    constructor(game, target, statusEffect) {
        this.game = game;
        this.target = target;
        this.statusEffect = statusEffect;
        this.intervalTick = new TickManager(statusEffect.interval);
        this.removeTick = new TickManager(statusEffect.remove);
    }
    effect() {
        this.statusEffect.effect({
            game: this.game,
            effect: this.statusEffect,
            target: this.target
        });
    }
    tick(type) {
        const intervalResult = this.intervalTick.tick(type);
        const removeResult = this.removeTick.tick(type);
        if (intervalResult)
            this.effect();
        if (removeResult)
            return true;
        return false;
    }
}
