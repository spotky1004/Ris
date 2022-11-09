import itemBundle from "../bundles/item.js";
import type Item from "../game/core/Item.js";
import type GameManager from "../game/core/GameManager.js";

export const items: Item[] = [];
let section: keyof typeof itemBundle;
for (section in itemBundle) {
  const itemSection = itemBundle[section] as { [K in string]: Item };
  for (const itemName in itemSection) {
    const item = itemSection[itemName];
    items.push(item);
  }
}

export default function initItemManager(gameManager: GameManager) {
  const itemManager = gameManager.itemManager;
  for (const item of items) {
    itemManager.addItem(item);
  }
}
