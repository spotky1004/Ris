import { Item } from "../essentials.js";

export default new Item({
  shopable: true,
  recipe: [],
  cost: 1,
  tier: 1,

  name: "HP",
  lore: "Health Point",
  on: "none",
  timing: "before",
  onEmit: async () => {}
});
