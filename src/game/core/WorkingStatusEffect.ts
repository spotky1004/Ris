import TickManager, { TickTypes } from "../util/TickManager.js";
import type Game from "../core/Game.js";
import type StatusEffect from "./StatusEffect.js";
import type PlaceableBase from "./PlaceableBase.js";
import type {
  GameEventNames,
  GameEventData,
  StatusEffectGameEventReturn
} from "@typings/GameEvent";

export default class WorkingStatusEffect<T extends GameEventNames = any> {
  private game: Game;
  readonly target: PlaceableBase;
  readonly data: StatusEffect<T>;
  readonly on: T;
  readonly intervalTick: TickManager;
  readonly removeTick: TickManager;

  constructor(game: Game, target: PlaceableBase, statusEffect: StatusEffect) {
    this.game = game;
    this.target = target;
    this.data = statusEffect;
    this.on = this.data.on;
    this.intervalTick = new TickManager(statusEffect.interval);
    this.removeTick = new TickManager(statusEffect.remove);
  }

  async emit<E extends GameEventNames>(event: E, timing: "before" | "after", data: GameEventData[E]): Promise<StatusEffectGameEventReturn[E] | void> {
    const { game, target, on, data: statusEffect } = this;
    if (
      // @ts-ignore
      event === on &&
      this.intervalTick &&
      this.isReadyToEmit()
    ) {
      // @ts-ignore
      const result = await statusEffect.onEffect({ game, target, event, data, timing });
      if (!result?.preventTickRestart) {
        this.intervalTick.restart();
      }
      return result ?? {};
    }
    return;
  }

  isReadyToEmit() {
    return this.intervalTick.isReady();
  }

  isReadyToRemove() {
    return this.removeTick.isReady();
  }

  tick(type: TickTypes) {
    this.intervalTick.tick(type);
    this.removeTick.tick(type);
  }
}
