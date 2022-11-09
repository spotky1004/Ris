import { messages } from "../../data/messageDatas.js";
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

interface ItemActivateEventReturnBase {
  ignoreDestroyOnEmit?: boolean;
  replyMsg?: string;
  errorMsg?: string;
}
export interface ItemActivateEventReturn extends ItemActivateEventTypes<ItemActivateEventReturnBase>  {
  "always": ItemActivateEventReturn[Exclude<ItemActivateEventNames, "always">];
  "otherPlayerMove": {
    ignoreDestroyOnEmit?: boolean;
    replyMsg?: string;
    errorMsg?: string;
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
  lore?: string;
  effectDescription?: string;
  paramDescription?: string[];
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
  readonly lore: string | undefined;
  readonly effectDescription: string;
  readonly paramDescription: string[];
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
    this.lore = options.lore;
    this.effectDescription = options.effectDescription ?? "...";
    this.paramDescription = options.paramDescription ?? [];
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

  getValueString() {
    return `[${this.cost}, ${messages.item["tier_order"][this.tier - 1]}]`;
  }

  getMinifiedInfo(markup: boolean=true) {
    if (markup) {
      const content = `**${this.name}** **${this.getValueString()}**`;
      return content;
    } else {
      const content = `${this.name} ${this.getValueString()}`;
      return content;
    }
  }

  getInfo(markup: boolean=true) {
    const W = 50;
    let content = ``;
    if (markup) {
      content += `+${"-".repeat(W - 2)}+\n`;
      content += `   < **${this.name}** > **${this.getValueString()}**\n\n`;
      if (this.lore) {
        content += `• ${messages.item["lore"]}\n`;
        content += `\`\`\`\n`;
        content += `- ${this.lore.replace(/\n/, "\n  ")}\n`;
        content += `\`\`\`\n`;
      }
      content += `• ${messages.item["description"]}\n`;
      content += `\`\`\`\n`;
      content += `- ${this.effectDescription.replace(/\n/, "\n  ")}\n`;
      content += `\`\`\`\n`;
      if (this.paramDescription.length > 0) {
        content += `• ${messages.item["param"]}\n`;
        content += `\`\`\`\n`;
        for (let i = 0; i < this.paramDescription.length; i++) {
          const desc = this.paramDescription[i];
          content += `${(i+1)}. ${desc.replace(/\n/, "\n   ")}`;
          content += "\n";
        }
        content = content.trim();
        content += `\`\`\`\n`;
      }
      content += `+${"-".repeat(W - 2)}+`;
    } else {
      content += `+${"-".repeat(W - 2)}+\n`;
      content += `   < ${this.name} > ${this.getValueString()}\n\n`;
      if (this.lore) {
        content += `// ${messages.item["lore"]}\n`;
        content += `- ${this.lore.replace(/\n/, "\n  ")}\n\n`;
      }
      content += `// ${messages.item["description"]}\n`;
      content += `- ${this.effectDescription.replace(/\n/, "\n  ")}\n`;
      if (this.paramDescription.length > 0) {
        content += `// ${messages.item["param"]}\n`;
        for (let i = 0; i < this.paramDescription.length; i++) {
          const desc = this.paramDescription[i];
          content += `${(i+1)}. ${desc.replace(/\n/, "\n   ")}`;
        }
      }
      content += `+${"-".repeat(W - 2)}+`;
    }
    return content.trim();
  }
}
