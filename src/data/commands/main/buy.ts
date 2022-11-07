import { createCommand, slashUtil } from "../essentials.js";
import { messages } from "../../messageDatas.js";
import buyableItems from "../../buyableItems.js";

const command = createCommand("buy");
command.slashCommand
  .addStringOption(option =>
    option
      .setName(messages.game["item"])
      .setDescription(messages.game["buy_command_param_desc"])
      .addChoices(...buyableItems.map(item => ({
        name: `${item.name} (${item.cost} cost)`,
        value: item.name
      })))
      .setRequired(true)
  );

command.handler = async ({ gameManager, channel, interaction, member }) => {
  const game = gameManager.getGame(channel.id);
  if (!game) {
    await slashUtil.reply(interaction, messages.err["err_game_not_started"]());
    return;
  }

  const curPlayer = game.getTurnPlayer();
  if (curPlayer.id !== member.id) {
    await slashUtil.reply(interaction, messages.game["not_your_turn"]());
    return;
  }

  const player = curPlayer;
  const itemName = slashUtil.getOption(interaction, messages.game["item"], "string", true);
  const itemToBuy = buyableItems.find(item => item.name === itemName);
  if (!itemToBuy) {
    await slashUtil.reply(interaction, messages.err["err_unexpected"]());
    return;
  }
  const result = player.marker.buyItem(itemToBuy);
  if (!result) {
    await slashUtil.reply(interaction, messages.game["buy_fail"](player, itemToBuy));
    return;
  }
  await slashUtil.reply(interaction, messages.game["buy_success"](player, itemToBuy));
};

export default command;
