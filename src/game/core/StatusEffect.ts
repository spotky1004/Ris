import { TickManagerOptions } from "../util/TickManager.js";
import type {
  GameEventNames,
  StatusEffectGameEventCallback,
  StatusChanges
} from "@typings/GameEvent";

export interface StatusEffectOptions<T extends GameEventNames> {
  id: string;
  displayName: string;
  alertOnAdded?: boolean;
  on: T;
  timing: "before" | "after";
  interval: TickManagerOptions;
  onEffect: StatusEffectGameEventCallback<T>;
  remove: TickManagerOptions;
  statusChanges?: StatusChanges;
}

export default class StatusEffect<T extends GameEventNames = any> {
  readonly id: string;
  readonly displayName: string;
  readonly alertOnAdded: boolean;
  readonly on: T;
  readonly timing: "before" | "after";
  readonly interval: TickManagerOptions;
  readonly onEffect: StatusEffectGameEventCallback<T>;
  readonly remove: TickManagerOptions;

  constructor(options: StatusEffectOptions<T>) {
    this.id = options.id;
    this.displayName = options.displayName;
    this.alertOnAdded = options.alertOnAdded ?? false;
    this.on = options.on;
    this.timing = options.timing;
    this.interval = options.interval;
    this.onEffect = options.onEffect;
    this.remove = options.remove;
  }
}
