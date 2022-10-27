import WorkingStatusEffect from "./WorkingStatusEffect.js";
import type Game from "../core/Game.js";
import type PlaceableBase from "../placeables/PlaceableBase.js";
import type StatusEffect from "./StatusEffect.js";

export type AttackType = "normal" | "true" | "rule";
export interface StatusManagerOptions {
  maxHp?: number;
  hp?: number;
  baseDef?: number;
  baseTureDef?: number;
  baseAtk?: number;
}

export default class StatusManager {
  private game: Game;
  parent: PlaceableBase;
  maxHp: number;
  hp: number;
  baseDef: number;
  baseTureDef: number;
  baseAtk: number;
  effects: WorkingStatusEffect[];

  constructor(game: Game, parent: PlaceableBase, options: StatusManagerOptions={}) {
    this.game = game;
    this.parent = parent;

    this.maxHp = options.maxHp ?? 0;
    this.hp = options.hp ?? options.maxHp ?? 0;
    this.baseDef = options.baseDef ?? 0;
    this.baseTureDef = options.baseTureDef ?? 0;
    this.baseAtk = options.baseAtk ?? 0;

    this.effects = [];
  }

  addStatusEffect(statusEffect: StatusEffect) {
    this.effects.push(new WorkingStatusEffect(
      this.game, this.parent, statusEffect
    ));
  }

  getDef() {
    let def = this.baseDef;
    return def;
  }

  getTureDef() {
    let trueDef = this.baseTureDef;
    return trueDef;
  }

  getAtk() {
    return this.baseAtk;
  }

  /** Attack and returns dealt damage */
  attack(atk: number, type: AttackType) {
    if (type === "normal") {
      atk *= (1 - this.getDef()/10);
    }
    if (type === "normal" || type === "true") {
      atk *= (1 - this.getTureDef()/10);
    }
    
    atk = Math.round(atk * 100)/100;
    this.hp -= atk;

    return atk;
  }
}
