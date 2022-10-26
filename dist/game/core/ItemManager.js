import crypto from "crypto";
export default class ItemManager {
    constructor() {
        this._items = [];
        this._shopables = [];
        this.recipeHash = new Map();
    }
    static calcMergeHash(...items) {
        const combined = items.map(item => item.name).sort().join("<- Combine ->");
        const hashed = crypto.createHash("sha256").update(combined).digest("hex");
        return hashed;
    }
    addItem(item) {
        this._items.push(item);
        if (item.recipe && item.recipe.length >= 1) {
            const hashed = ItemManager.calcMergeHash(...item.recipe);
            this.recipeHash.set(hashed, item);
        }
        if (item.shopable) {
            this.shopables.push(item);
        }
    }
    tryMerge(...items) {
        const hash = ItemManager.calcMergeHash(...items);
        const isExist = this.recipeHash.has(hash);
        if (!isExist)
            return null;
        return this.recipeHash.get(hash);
    }
    get items() {
        return [...this._items];
    }
    get shopables() {
        return [...this._shopables];
    }
}
