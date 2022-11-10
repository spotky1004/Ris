import { messages } from "../../data/messageDatas.js";
import type { TickManagerOptions } from "../util/TickManager.js";
import type { StatusNames } from "./StatusManager.js";
import type {
  GameEventNames,
  ItemGameEventCallback,
  StatusChanges,
  StatusChangeData
} from "@typings/GameEvent";

interface ItemOptions<T extends GameEventNames> {
  name: string;
  lore?: string;
  effectDescription?: string;
  paramDescription?: string[];
  /** default: true */
  unlockedDefault?: boolean;
  /** default: false */
  shopable?: boolean;
  cost?: number;
  recipe?: Item[] | (() => Item[]);
  tier?: number;
  on: T;
  timing: "before" | "after";
  chargeOptions?: TickManagerOptions;
  /** default: false */
  destroyOnEmit?: boolean;
  onEmit: ItemGameEventCallback<T>;
  statusChanges?: StatusChanges;
}

export default class Item<T extends GameEventNames = any> {
  readonly name: string;
  readonly lore: string | undefined;
  readonly effectDescription: string;
  readonly paramDescription: string[];
  readonly unlockedDefault: boolean;
  readonly _recipe: Item[] | (() => Item[]);
  readonly shopable: boolean;
  cost: number;
  tier: number;
  readonly on: T;
  readonly timing: "before" | "after";
  readonly chargeOptions: null | TickManagerOptions;
  readonly destroyOnEmit: boolean;
  readonly onEmit: ItemGameEventCallback<T>;
  readonly statusChanges: Map<StatusNames, StatusChangeData>;

  constructor(options: ItemOptions<T>) {
    this.name = options.name;
    this.lore = options.lore;
    this.effectDescription = options.effectDescription ?? "...";
    this.paramDescription = options.paramDescription ?? [];
    this.unlockedDefault = options.unlockedDefault ?? true;
    this._recipe = options.recipe ?? [];
    this.shopable = options.shopable ?? false;
    this.on = options.on;
    this.timing = options.timing;
    this.chargeOptions = options.chargeOptions ?? null;
    this.destroyOnEmit = options.destroyOnEmit ?? false;
    this.onEmit = options.onEmit;
    this.statusChanges = new Map(Object.entries(options.statusChanges ?? {})) as Map<StatusNames, StatusChangeData>;

    this.cost = options.cost ?? 0;
    this.tier = options.tier ?? 1;
    if (Array.isArray(this._recipe)) this.init();
  }

  init() {
    let tier = this.tier ?? 1;
    let cost: number = this.cost ?? 0;
    if (this.recipe.length > 0) {
      tier = Math.max(...this.recipe.map(item => item.tier)) + 1;
      cost = this.recipe.reduce((a, b) => a + b.cost, 0);
    }
    this.tier = tier;
    this.cost = cost;
  }

  get recipe() {
    if (Array.isArray(this._recipe)) {
      return this._recipe;
    } else {
      return this._recipe();
    }
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
        content += `- ${this.lore.replace(/\n/, "\n  ")}\n\n`;
      }
      content += `• ${messages.item["description"]}\n`;
      content += `${this.effectDescription.replace(/\n/, "\n  ")}\n\n`;
      if (this.paramDescription.length > 0) {
        content += `• ${messages.item["param"]}\n`;
        for (let i = 0; i < this.paramDescription.length; i++) {
          const desc = this.paramDescription[i];
          content += `${(i+1)}. ${desc.replace(/\n/, "\n   ")}`;
          content += "\n";
        }
      }
      content = content.trim();
      content += `\n+${"-".repeat(W - 2)}+`;
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
