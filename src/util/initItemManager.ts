import itemArr from "../bundles/itemArr.js";
import type GameManager from "../game/core/GameManager.js";

export default function initItemManager(gameManager: GameManager) {
  const itemManager = gameManager.itemManager;
  for (const item of itemArr) {
    item.init();
    itemManager.addItem(item);
  }
}
