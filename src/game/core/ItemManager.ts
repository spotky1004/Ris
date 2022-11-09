import crypto from "crypto";
import type Item from "./Item.js";

export default class ItemManager {
  private _items: Item[];
  private _shopables: Item[];
  private recipeHash: Map<string, Item>;

  constructor() {
    this._items = [];
    this._shopables = [];
    this.recipeHash = new Map();
  }

  static calcMergeHash(...items: Item[]) {
    const combined = items.map(item => item.name).sort().join("<- Combine ->");
    const hashed = crypto.createHash("sha256").update(combined).digest("hex");
    return hashed;
  }

  addItem(item: Item) {
    this._items.push(item);
    if (item._recipe && item._recipe.length >= 1) {
      const hashed = ItemManager.calcMergeHash(...item.recipe);
      this.recipeHash.set(hashed, item);
    }
    if (item.shopable) {
      this.shopables.push(item);
    }
  }

  tryMerge(...items: Item[]) {
    const hash = ItemManager.calcMergeHash(...items);
    const isExist = this.recipeHash.has(hash);
    if (!isExist) return null;
    return this.recipeHash.get(hash) as Item;
  }

  get items() {
    return [...this._items];
  }

  get shopables() {
    return [...this._shopables];
  }
}
