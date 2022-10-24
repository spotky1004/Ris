import TickManager from "./TickManager.js";
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
    allTick() {
        const intervalResult = this.intervalTick.allTick();
        const removeResult = this.removeTick.allTick();
        if (intervalResult)
            this.effect();
        if (removeResult)
            return true;
        return false;
    }
    playerTick() {
        const intervalResult = this.intervalTick.playerTick();
        const removeResult = this.removeTick.playerTick();
        if (intervalResult)
            this.effect();
        if (removeResult)
            return true;
        return false;
    }
    moveTick() {
        const intervalResult = this.intervalTick.moveTick();
        const removeResult = this.removeTick.moveTick();
        if (intervalResult)
            this.effect();
        if (removeResult)
            return true;
        return false;
    }
}
