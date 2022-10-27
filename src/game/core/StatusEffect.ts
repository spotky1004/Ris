import { TickManagerOptions } from "../etc/TickManager.js";
import type Game from "./Game.js";
import type PlaceableBase from "../placeables/PlaceableBase.js";

interface StatusEffectArgs {
  game: Game;
  effect: StatusEffect;
  target: PlaceableBase;
}
type StatusEffectCallback = (args: StatusEffectArgs) => void;

export interface StatusEffectOptions {
  id: string;
  name: string;
  interval: TickManagerOptions;
  effect: StatusEffectCallback;
  remove: TickManagerOptions;
}

export default class StatusEffect {
  readonly id: string;
  readonly name: string;
  readonly interval: TickManagerOptions;
  readonly effect: StatusEffectCallback;
  readonly remove: TickManagerOptions;

  constructor(options: StatusEffectOptions) {
    this.id = options.id;
    this.name = options.name;
    this.interval = options.interval;
    this.effect = options.effect;
    this.remove = options.remove;
  }
}
