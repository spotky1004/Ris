import type Game from "./Game.js";
import type { TickManagerOptions } from "../etc/TickManager.js";
import type Player from "../placeables/Player.js";

type ItemActivateEventNames =
  "used" | "always" |
  "move" | "kill" | "myTurnStart" | "myTurnEnd" |
  "playerTurnStart" | "playerTurnEnd" | "allTurnStart" | "allTurnEnd" |
  "gameEnd" | "death" | "attack" | "attacked";
type ItemActivateEventData = {
  "used": {};
  "always": {};
  "move": {
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
};

interface ItemActivateCallbackArg<T extends ItemActivateEventNames> {
  game: Game;
  owner: Player;
  data: ItemActivateEventData[T];
}
/** Return true to cancel default */
type ItemActivateCallback<T extends ItemActivateEventNames> = (arg: ItemActivateCallbackArg<T>) => boolean | void;

interface ItemOptions<T extends ItemActivateEventNames> {
  name: string;
  /** default: true */
  unlockedDefault?: boolean;
  madeFrom: null | number | Item<any>[];
  tier?: number;
  on: T;
  chargeOptions?: TickManagerOptions;
  /** default: false */
  destroyOnEmit?: boolean;
  onEmit: ItemActivateCallback<T>;
}

export default class Item<T extends ItemActivateEventNames> {
  readonly name: string;
  readonly unlockedDefault: boolean;
  readonly madeFrom: null | number | Item<any>[];
  readonly tier: number;
  readonly on: T;
  readonly chargeOptions: null | TickManagerOptions;
  readonly destroyOnEmit: boolean;
  readonly onEmit: ItemActivateCallback<T>;

  constructor(options: ItemOptions<T>) {
    this.name = options.name;
    this.unlockedDefault = options.unlockedDefault ?? true;
    this.madeFrom = options.madeFrom;
    this.on = options.on;
    this.chargeOptions = options.chargeOptions ?? null;
    this.destroyOnEmit = options.destroyOnEmit ?? false;
    this.onEmit = options.onEmit;

    let tier = options.tier ?? 1;
    if (Array.isArray(this.madeFrom)) {
      tier = Math.max(...this.madeFrom.map(item => item.tier)) + 1;
    }
    this.tier = tier;
  }
}

const item = new Item({
  name: "Attack Debugger",
  on: "attacked",
  onEmit: ({ game, owner, data }) => {
    game.sender.send(`${data.from.memberName} attacked ${owner.memberName} for ${data.damage} damage!`);

    const players = game.board.getAllPlaceables("Player");
    console.log(players.includes(owner) ? "The owner is on the board" : "The owner isn't on the board?");

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
  madeFrom: 32
});
console.log(item);
