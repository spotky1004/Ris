import type Game from "../game/core/Game.js";
import type PlaceableBase from "../game/core/PlaceableBase.js";
import type Player from "../game/core/Player.js";
import type { StatusNames } from "../game/core/StatusManager.js";

export type GameEventNames =
  "used" | "always" | "none" |
  "move" | "placeableMove" | "kill" |
  "playerTurnStart" | "playerTurnEnd" | "allTurnStart" | "allTurnEnd" |
  "gameEnd" | "death" | "attack" | "attacked";
type GameEventTypes<T> = {
  [K in GameEventNames]: T;
};

export interface GameEventData extends GameEventTypes<{}> {
  "always": GameEventData[Exclude<GameEventNames, "always">];
  "used": {
    param: string[];
  },
  "none": {};
  "move": {
    prevPos: [x: number, y: number];
    curPos: [x: number, y: number];
  };
  "placeableMove": {
    placeable: PlaceableBase;
    prevPos: [x: number, y: number];
    curPos: [x: number, y: number];
  };
  "kill": {
    damage: number;
    killed: PlaceableBase;
  };
  "playerTurnStart": {
    target: Player;
  };
  "playerTurnEnd": {
    target: Player;
  };
  "allTurnStart": {
    target: Player;
  };
  "allTurnEnd": {
    target: Player;
  };
  "gameEnd": {
    winner: Player;
  };
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

export interface GameEventReturn extends GameEventTypes<{}> {
  "always": GameEventReturn[Exclude<GameEventNames, "always">];
  "placeableMove": {
    cancelMove?: boolean;
  };
  "used": {
    errorMsg?: string;
  };
}

// for Item
interface ItemGameEventReturnBase {
  perioty?: number;
  ignoreDestroyOnEmit?: boolean;
  preventTickRestart?: boolean;
  message?: string;
}
export type ItemGameEventReturn = { [K in GameEventNames] : GameEventReturn[K] & ItemGameEventReturnBase };

// for StatusEffect
interface StatusEffectGameEventReturnBase {
  perioty?: number;
  preventTickRestart?: boolean;
  message?: string;
  removeEffect?: boolean;
}
export type StatusEffectGameEventReturn = { [K in GameEventNames] : GameEventReturn[K] & StatusEffectGameEventReturnBase };

interface GameEventCallbackArgStruct<T extends GameEventNames> {
  game: Game;
  target: PlaceableBase;
  event: T;
  timing: "before" | "after";
  data: GameEventData[T];
}
export type GameEventCallbackArg<T extends GameEventNames> = T extends "always" ?
  { [K in GameEventNames] : GameEventCallbackArgStruct<K> }[GameEventNames] :
  GameEventCallbackArgStruct<T>;
export type GameEventCallback<T extends GameEventNames> =
  ((arg: GameEventCallbackArg<T>) => Promise<GameEventReturn[T] | void>);
export type ItemGameEventCallback<T extends GameEventNames> =
  ((arg: GameEventCallbackArg<T>) => Promise<ItemGameEventReturn[T] | void>);
export type StatusEffectGameEventCallback<T extends GameEventNames> =
  ((arg: GameEventCallbackArg<T>) => Promise<StatusEffectGameEventReturn[T] | void>);

type StatusChangeCallback = (cur: number, game: Game) => number;
export interface StatusChangeData {
  priority: number;
  callback: StatusChangeCallback;
}
export type StatusChanges = {
  [K in StatusNames]?: StatusChangeData;
}
