import type Game from "../game/core/Game.js";
import type PlaceableBase from "../game/core/PlaceableBase.js";
import type { StatusNames } from "../game/core/StatusManager.js";

export type GameEventNames =
  "used" | "always" | "none" |
  "move" | "otherPlayerMove" | "kill" | "myTurnStart" | "myTurnEnd" |
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

export interface GameEventReturn extends GameEventTypes<{}> {
  "always": GameEventReturn[Exclude<GameEventNames, "always">];
  "otherPlayerMove": {
    cancelMove?: boolean;
  };
}

// for Item
interface ItemGameEventReturnBase {
  ignoreDestroyOnEmit?: boolean;
  replyMsg?: string;
  errorMsg?: string;
}
export type ItemGameEventReturn = { [K in GameEventNames] : GameEventReturn[K] & ItemGameEventReturnBase };

// for StatusEffect
interface StatusEffectGameEventReturnBase {
  remove?: boolean;
}
export type StatusEffectGameEventReturn = { [K in GameEventNames] : GameEventReturn[K] & StatusEffectGameEventReturnBase };

interface GameEventCallbackArgStruct<T extends GameEventNames> {
  game: Game;
  target: PlaceableBase;
  event: T;
  data: GameEventData[T];
}
export type GameEventCallbackArg<T extends GameEventNames> = T extends "always" ?
  { [K in GameEventNames] : GameEventCallbackArgStruct<K> }[GameEventNames] :
  GameEventCallbackArgStruct<T>;
export type GameEventCallback<T extends GameEventNames> =
  ((arg: GameEventCallbackArg<T>) => Promise<GameEventReturn[T] | void>);

type StatusChangeCallback = (cur: number, game: Game) => number;
export interface StatusChangeData {
  priority: number;
  callback: StatusChangeCallback;
}
export type StatusChanges = {
  [K in StatusNames]?: StatusChangeData;
}
