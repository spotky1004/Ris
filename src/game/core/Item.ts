import type Game from "./Game.js";
import type { TickManagerOptions } from "../util/TickManager.js";
import type PlaceableBase from "./PlaceableBase.js";
import type { StatusNames } from "./StatusManager.js";

export type ItemActivateEventNames =
  "used" | "always" | "none" |
  "move" | "otherPlayerMove" | "kill" | "myTurnStart" | "myTurnEnd" |
  "playerTurnStart" | "playerTurnEnd" | "allTurnStart" | "allTurnEnd" |
  "gameEnd" | "death" | "attack" | "attacked";
type ItemActivateEventTypes<T> = {
  [K in ItemActivateEventNames]: T;
};

export interface ItemActivateEventData extends ItemActivateEventTypes<{}> {
  "always": ItemActivateEventData[Exclude<ItemActivateEventNames, "always">];
  "none": {};
  "move": {
    prevPos: [x: number, y: number];
    curPos: [x: number, y: number];
  };
  "otherPlayerMove": {
    player: PlaceableBase;
    prevPos: [x: number, y: number];
    curPos: [x: number, y: number];
  };
  "kill": {
    damage: number;
    killed: PlaceableBase;
  };
  "myTurnStart": {};
  "myTurnEnd": {};
  "playerTurnStart": {
    target: PlaceableBase;
  };
  "playerTurnEnd": {
    target: PlaceableBase;
  };
  "allTurnStart": {
    target: PlaceableBase;
  };
  "allTurnEnd": {
    target: PlaceableBase;
  };
  "gameEnd": {};
  "death": {
    damage: number;
    killedBy: PlaceableBase;
  };
  "attack": {
    damage: number;
    target: PlaceableBase;
  };
  "attacked": {
    damage: number;
    from: PlaceableBase;
  };
}

interface ItemActivateEventReturnBase {
  ignoreDestroyOnEmit?: boolean;
}
export interface ItemActivateEventReturn extends ItemActivateEventTypes<ItemActivateEventReturnBase>  {
  "always": ItemActivateEventReturn[Exclude<ItemActivateEventNames, "always">];
  "otherPlayerMove": {
    ignoreDestroyOnEmit?: boolean;
    cancelMove: boolean;
  };
}

interface ItemActivateCallbackArgBuider<T extends ItemActivateEventNames> {
  game: Game;
  owner: PlaceableBase;
  event: T;
  data: ItemActivateEventData[T];
}
export type ItemActivateCallbackArg<T extends ItemActivateEventNames> = T extends "always" ?
  { [K in ItemActivateEventNames] : ItemActivateCallbackArgBuider<K> }[ItemActivateEventNames] :
  ItemActivateCallbackArgBuider<T>;
type ItemActivateCallback<T extends ItemActivateEventNames> =
  ((arg: ItemActivateCallbackArg<T>) => Promise<ItemActivateEventReturn[T] | void>);
type ItemStatusChangeCallback = (cur: number, game: Game) => number;

interface ItemOptions<T extends ItemActivateEventNames> {
  name: string;
  /** default: true */
  unlockedDefault?: boolean;
  /** default: false */
  shopable?: boolean;
  cost?: number;
  recipe?: Item[];
  tier?: number;
  on: T;
  timing: "before" | "after";
  chargeOptions?: TickManagerOptions;
  /** default: false */
  destroyOnEmit?: boolean;
  onEmit: ItemActivateCallback<T>;
  statusChanges?: {
    [K in StatusNames]?: ItemStatusChangeCallback;
  };
}

export default class Item<T extends ItemActivateEventNames = any> {
  readonly name: string;
  readonly unlockedDefault: boolean;
  readonly recipe: Item[] | null;
  readonly shopable: boolean;
  cost: number;
  readonly tier: number;
  readonly on: T;
  readonly timing: "before" | "after";
  readonly chargeOptions: null | TickManagerOptions;
  readonly destroyOnEmit: boolean;
  readonly onEmit: ItemActivateCallback<T>;
  readonly statusChanges: Map<StatusNames, ItemStatusChangeCallback>;

  constructor(options: ItemOptions<T>) {
    this.name = options.name;
    this.unlockedDefault = options.unlockedDefault ?? true;
    this.recipe = options.recipe ?? [];
    this.shopable = options.shopable ?? false;
    this.on = options.on;
    this.timing = options.timing;
    this.chargeOptions = options.chargeOptions ?? null;
    this.destroyOnEmit = options.destroyOnEmit ?? false;
    this.onEmit = options.onEmit;
    this.statusChanges = new Map(Object.entries(options.statusChanges ?? {})) as Map<StatusNames, ItemStatusChangeCallback>;

    let tier = options.tier ?? 1;
    let cost: number = options.cost ?? 0;
    if (this.recipe.length > 0) {
      tier = Math.max(...this.recipe.map(item => item.tier)) + 1;
      cost = this.recipe.reduce((a, b) => a + b.cost, 0);
    }
    this.tier = tier;
    this.cost = cost;
  }
}
