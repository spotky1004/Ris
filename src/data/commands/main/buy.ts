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
  if (!curPlayer) {
    await slashUtil.reply(interaction, messages.err["err_unexpected"]());
    return;
  }
  if (curPlayer.id !== member.id) {
    await slashUtil.reply(interaction, messages.game["not_your_turn"]());
    return;
  }

  const player = curPlayer;
  if (!player.marker) {
    await slashUtil.reply(interaction, messages.err["err_unexpected"]());
    return;
  }

  const toBuy = (interaction.options.get(messages.game["item"], true).value ?? "") as string;
  console.log(toBuy);
};

export default command;
