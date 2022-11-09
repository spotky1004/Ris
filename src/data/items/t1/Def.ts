import { Item } from "../essentials.js";

export default new Item({
  shopable: true,
  recipe: [],
  cost: 2,
  tier: 1,

  name: "Def",
  lore: "Defence",
  on: "none",
  timing: "before",
  onEmit: async () => {}
});