import { createCommand, slashUtil } from "../essentials.js";
import { messages } from "../../messageDatas.js";

const command = createCommand("use");
command.slashCommand
  .addNumberOption(option =>
    option
      .setName("nr")
      .setDescription("No description.")
      .setRequired(true)
  )

command.handler = async ({ gameManager, channel, interaction, member }) => {
  const game = gameManager.getGame(channel.id);
  if (!game) {
    await slashUtil.reply(interaction, messages.err["err_game_not_started"]);
    return;
  }

  const curPlayer = game.getTurnPlayer();
  if (curPlayer.id !== member.id) {
    await slashUtil.reply(interaction, messages.game["not_your_turn"]);
    return;
  }
  if (curPlayer.actionCountLeft < 1) {
    await slashUtil.reply(interaction, messages.game["action_count_exceeded"](curPlayer.actionCountLeft, game.config.actionCount));
    return;
  }

  const idxToUse = slashUtil.getOption(interaction, "nr", "number", true);
  const result = await curPlayer.marker.useItem(idxToUse);
  if (!result) {
    await slashUtil.reply(interaction, messages.command["use_fail"]);
    return;
  }

  await slashUtil.reply(interaction, messages.command["use_success"](result.data));
  curPlayer.actionCountLeft--;
}

export default command;
