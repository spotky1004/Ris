import { Item } from "../essentials.js";
import item from "../../../bundles/item.js";

export default new Item({
  recipe: () => [item.old.HP, item.old.MP, item.old.Def],
  cost: 5,
  tier: 1,

  name: "SP",
  lore: "Skill Point",
  effectDescription: "**[ Respec ]** Give random **'Tier I'** that sum of cost is **5** when used.",
  on: "used",
  timing: "before",
  onEmit: async ({ target }) => {
    const avaiables = [item.old.HP, item.old.MP, item.old.Def];
    const selected = [];
    let costLeft = 5;
    while (costLeft > 0) {
      const toSelect = avaiables[Math.floor(Math.random() * avaiables.length)];
      if (toSelect.cost > costLeft) continue;
      costLeft -= toSelect.cost;
      selected.push(toSelect);
    }

    let message = `You got:`;
    for (const item of selected) {
      message += ` **${item.name}**`;
      target.addItem(item);
    }

    return {
      message: message
    }
  }
});
