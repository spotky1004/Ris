import WorkingStatusEffect from "./WorkingStatusEffect.js";
import { messages } from "../../data/messageDatas.js";
import type Game from "../core/Game.js";
import type PlaceableBase from "./PlaceableBase.js";
import type StatusEffect from "./StatusEffect.js";
import type {
  GameEventNames,
  GameEventData,
  StatusEffectGameEventReturn,
  StatusChangeData,
} from "@typings/GameEvent";

export type AttackType = "normal" | "true" | "rule";
export const attackTypeOrder: AttackType[] = ["rule", "true", "normal"];
export type Damage = {
  [K in AttackType]?: number;
};
export type StatusNames = "maxHp" | "def" | "tureDef" | "normalAtk" | "trueAtk" | "ruleAtk";
export interface StatusManagerOptions {
  maxHp?: number;
  hp?: number;
  baseDef?: number;
  baseTureDef?: number;
  baseDamage?: Damage;
}

export default class StatusManager {
  private game: Game;
  parent: PlaceableBase;
  maxHp: number;
  hp: number;
  baseDef: number;
  baseTureDef: number;
  baseDamage: Damage;
  effects: WorkingStatusEffect[];

  constructor(game: Game, parent: PlaceableBase, options: StatusManagerOptions={}) {
    this.game = game;
    this.parent = parent;

    this.maxHp = options.maxHp ?? 0;
    this.hp = options.hp ?? options.maxHp ?? 0;
    this.baseDef = options.baseDef ?? 0;
    this.baseTureDef = options.baseTureDef ?? 0;
    this.baseDamage = options.baseDamage ?? {};

    this.effects = [];
  }

  async addStatusEffect(effect: StatusEffect) {
    this.effects.push(new WorkingStatusEffect(
      this.game, this.parent, effect
    ));
    if (effect.alertOnAdded) {
      await this.game.messageSender.send(messages.game["status_effect_alert"](effect, this.parent));
    }
  }

  removeStatusEffect(effect: WorkingStatusEffect) {
    const idx = this.effects.findIndex(e => e === effect);
    if (idx === -1) return null;
    return this.effects.splice(idx, 1)[0];
  }

  getStatusEffects<T extends undefined | GameEventNames>(type?: T, timing?: "before" | "after") {
    type Type = T extends undefined ? GameEventNames : T;
    const effects: WorkingStatusEffect<Type>[] = [];
    for (const effect of this.effects) {
      if (
        (effect.on === type && effect.data.timing === timing) ||
        typeof type === "undefined" ||
        effect.on === "always"
      ) {
        effects.push(effect);
      }
    }
    return effects;
  }

  async emitStatusEffects<T extends GameEventNames>(type: T, timing: "before" | "after", data: GameEventData[T]): Promise<StatusEffectGameEventReturn[T][]> {
    const effectsToEmit = this.getStatusEffects(type, timing);
    const returnVals: StatusEffectGameEventReturn[T][] = [];
    for (const effect of effectsToEmit) {
      const returnVal = await effect.emit(type, timing, data);
      if (returnVal) returnVals.push(returnVal);
      const remove = returnVal?.removeEffect ?? false;
      if (
        remove ||
        ( effect.isReadyToRemove() && (!returnVal || !remove) )
      ) {
        this.removeStatusEffect(effect);
      }
    }
    return returnVals.sort((a, b) => (a.perioty ?? 1) - (b.perioty ?? 1));
  }

  getItemStat(base: number, name: StatusNames) {
    const statChangeDatas: StatusChangeData[] = [];
    for (const item of this.parent.items) {
      const statChangeData = item.data.statusChanges.get(name);
      if (!statChangeData) continue;
      statChangeDatas.push(statChangeData);
    }
    
    statChangeDatas.sort((a, b) => a.priority - b.priority);
    for (const { callback } of statChangeDatas) {
      base = callback(base, this.game);
    }
    
    return base;
  }

  getMaxHp() {
    return this.getItemStat(this.maxHp, "maxHp");
  }

  getDef() {
    return this.getItemStat(this.baseDef, "def");
  }

  getTureDef() {
    return this.getItemStat(this.baseTureDef, "tureDef");
  }

  getDamage(): Damage {
    return {
      normal: this.getItemStat(this.baseDamage.normal ?? 0, "normalAtk"),
      true: this.getItemStat(this.baseDamage.true ?? 0, "trueAtk"),
      rule: this.getItemStat(this.baseDamage.rule ?? 0, "ruleAtk"),
    };
  }

  /** Attack and returns dealt damage */
  attack(damage: Damage) {
    damage = {...damage};
    if (damage.normal) {
      damage.normal *= (1 - this.getDef()/10);
    }
    if (damage.true) {
      damage.true *= (1 - this.getTureDef()/10);
    }
    for (const attackType of attackTypeOrder) {
      let dmg = damage[attackType];
      if (typeof dmg === "undefined") continue;
      dmg = Math.max(0, Math.round(dmg * 100)/100);
      damage[attackType] = dmg;
      if (attackType === "normal" || attackType === "rule" || attackType === "true") {
        this.hp = Math.round((this.hp - dmg) * 100) / 100;
      }
    }

    if (this.hp <= 0) {
      this.parent.death();
    }

    return damage;
  }
}
