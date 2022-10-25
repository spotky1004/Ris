import type Game from "./Game.js";
import type { TickManagerOptions } from "../etc/TickManager.js";
import type Player from "../placeables/Player.js";

type ItemActivateEventNames =
  "used" | "always" | "none" |
  "move" | "otherPlayerMove" | "kill" | "myTurnStart" | "myTurnEnd" |
  "playerTurnStart" | "playerTurnEnd" | "allTurnStart" | "allTurnEnd" |
  "gameEnd" | "death" | "attack" | "attacked";
type ItemActivateEventTypes<T> = {
  [K in ItemActivateEventNames]: T;
};

interface ItemActivateEventData extends ItemActivateEventTypes<{}> {
  "always": ItemActivateEventData[Exclude<ItemActivateEventNames, "always">];
  "none": {};
  "move": {
    prevPos: [x: number, y: number];
    curPos: [x: number, y: number];
  };
  "otherPlayerMove": {
    player: Player;
    prevPos: [x: number, y: number];
    curPos: [x: number, y: number];
  };
  "kill": {
    damage: number;
    killed: Player;
  };
  "myTurnStart": {};
  "myTurnEnd": {};
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
  "gameEnd": {};
  "death": {
    damage: number;
    killedBy: Player;
  };
  "attack": {
    damage: number;
    target: Player;
  };
  "attacked": {
    damage: number;
    from: Player;
  }
}
interface ItemActivateEventReturn extends ItemActivateEventTypes<any>  {
  /** true -> ignore destroyOnEmit */
  "used": boolean;
  /** * */
  "always": any;
  /** true -> cancel move */
  "otherPlayerMove": boolean;
}

interface ItemActivateCallbackArg<T extends ItemActivateEventNames> {
  game: Game;
  owner: Player;
  event: T;
  data: ItemActivateEventData[T];
}
type ItemActivateCallback<T extends ItemActivateEventNames> = T extends "always" ?
  ((arg: ItemActivateCallbackArg<any>) => any) :
  ((arg: ItemActivateCallbackArg<T>) => ItemActivateEventReturn[T] | void);

interface ItemOptions<T extends ItemActivateEventNames> {
  name: string;
  /** default: true */
  unlockedDefault?: boolean;
  cost?: number;
  madeFrom: Item[];
  tier?: number;
  on: T;
  timing: "before" | "after";
  chargeOptions?: TickManagerOptions;
  /** default: false */
  destroyOnEmit?: boolean;
  onEmit: ItemActivateCallback<T>;
}

export default class Item<T extends ItemActivateEventNames = "none"> {
  readonly name: string;
  readonly unlockedDefault: boolean;
  readonly madeFrom: null | number | Item[];
  cost: number;
  readonly tier: number;
  readonly on: T;
  readonly timing: "before" | "after";
  readonly chargeOptions: null | TickManagerOptions;
  readonly destroyOnEmit: boolean;
  readonly onEmit: ItemActivateCallback<T>;

  constructor(options: ItemOptions<T>) {
    this.name = options.name;
    this.unlockedDefault = options.unlockedDefault ?? true;
    this.madeFrom = options.madeFrom;
    this.on = options.on;
    this.timing = options.timing;
    this.chargeOptions = options.chargeOptions ?? null;
    this.destroyOnEmit = options.destroyOnEmit ?? false;
    this.onEmit = options.onEmit;

    let tier = options.tier ?? 1;
    let cost: number = options.cost ?? 0;
    if (this.madeFrom.length > 0) {
      tier = Math.max(...this.madeFrom.map(item => item.tier)) + 1;
      cost = this.madeFrom.reduce((a, b) => a + b.cost, 0);
    }
    this.tier = tier;
    this.cost = cost;
  }
}

const item = new Item({
  name: "Attack Debugger",
  on: "attacked",
  timing: "after",

  onEmit: ({ game, owner, data }) => {
    game.sender.send(`${data.from.memberName} attacked ${owner.memberName} for ${data.damage} damage!`);

    const players = game.board.getAllPlaceables("Player");
    console.log(players.includes(owner) ? "The owner is on the board" : "The owner isn't on the board..?");

    const walls = game.board.getAllPlaceables(/^wall/g);
    console.log(walls);
  },
  unlockedDefault: false,
  chargeOptions: {
    type: "move",
    length: 3
  },
  destroyOnEmit: false,
  tier: 5,
  madeFrom: [],
  cost: 32
});
console.log(item);
