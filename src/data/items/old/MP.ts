import { Item } from "../essentials.js";

export default new Item({
  recipe: [],
  cost: 2,
  tier: 1,

  name: "MP",
  lore: "Mana Point",
  on: "none",
  timing: "before",
  onEmit: async () => {}
});
