import TickManager, { TickTypes } from "../util/TickManager.js";
import type Game from "../core/Game.js";
import type StatusEffect from "./StatusEffect.js";
import type PlaceableBase from "./PlaceableBase.js";

export default class WorkingStatusEffect {
  private game: Game;
  readonly target: PlaceableBase;
  readonly statusEffect: StatusEffect;
  readonly intervalTick: TickManager;
  readonly removeTick: TickManager;

  constructor(game: Game, target: PlaceableBase, statusEffect: StatusEffect) {
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

  tick(type: TickTypes) {
    const intervalResult = this.intervalTick.tick(type);
    const removeResult = this.removeTick.tick(type);
    if (intervalResult) this.effect();
    if (removeResult) return true;
    return false;
  }
}
