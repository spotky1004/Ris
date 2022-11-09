import itemBundle from "./item.js";
import type Item from "../game/core/Item.js";

const itemArr: Item[] = [];
let section: keyof typeof itemBundle;
for (section in itemBundle) {
  const itemSection = itemBundle[section] as { [K in string]: Item };
  for (const itemName in itemSection) {
    const item = itemSection[itemName];
    itemArr.push(item);
  }
}

export default itemArr;
