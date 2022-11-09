import { createCommand, slashUtil } from "../essentials.js";
import { messages } from "../../messageDatas.js";
import buyableItems from "../../buyableItems.js";

const command = createCommand("buy");
command.slashCommand
  .addStringOption(option =>
    option
      .setName(messages.game["item"])
      .setDescription(messages.command["buy_command_param_desc"])
      .addChoices(...buyableItems.map(item => ({
        name: `${item.name} (${item.cost} cost)`,
        value: item.name
      })))
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName("count")
      .setDescription("...")
  );

command.handler = async ({ gameManager, channel, interaction, member }) => {
  const game = await slashUtil.getGame(interaction, gameManager, channel);
  if (!game) return;
  const player = await slashUtil.getCurPlayer(interaction, game, member);
  if (!player) return;
  
  const itemName = slashUtil.getOption(interaction, messages.game["item"], "string", true);
  const buyCount = slashUtil.getOption(interaction, "count", "number") ?? 1;
  const itemToBuy = buyableItems.find(item => item.name === itemName);
  if (!itemToBuy || buyCount < 1) {
    await slashUtil.reply(interaction, messages.err["err_unexpected"], true);
    return;
  }
  const result = player.marker.buyItem(itemToBuy, buyCount);
  if (!result) {
    await slashUtil.reply(interaction, messages.command["buy_fail"](player, itemToBuy, buyCount), true);
    return;
  }
  await slashUtil.reply(interaction, messages.command["buy_success"](player, itemToBuy, buyCount), true);
};

export default command;
