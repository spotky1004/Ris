import { createCommand, slashUtil } from "../essentials.js";
import { messages } from "../../messageDatas.js";

const command = createCommand("merge");
command.slashCommand
  .addIntegerOption(option =>
    option
      .setName("nr1")
      .setDescription("No description.")
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName("nr2")
      .setDescription("No description.")
      .setRequired(true)
  )
  .addIntegerOption(option =>
    option
      .setName("nr3")
      .setDescription("No description.")
  )
  .addIntegerOption(option =>
    option
      .setName("nr4")
      .setDescription("No description.")
  )
  .addIntegerOption(option =>
    option
      .setName("nr5")
      .setDescription("No description.")
  );

command.handler = async ({ gameManager, channel, interaction, member }) => {
  const game = await slashUtil.getGame(interaction, gameManager, channel);
  if (!game) return;
  const player = await slashUtil.getCurPlayer(interaction, game, member);
  if (!player) return;

  const maxActionCount = game.config.actionCount;
  if (player.actionCountLeft < 1) {
    await slashUtil.reply(interaction, messages.game["action_count_exceeded"](player.actionCountLeft, maxActionCount), true);
    return;
  }

  const idxes: number[] = [
    slashUtil.getOption(interaction, "nr1", "number", true),
    slashUtil.getOption(interaction, "nr2", "number", true),
    slashUtil.getOption(interaction, "nr3", "number"),
    slashUtil.getOption(interaction, "nr4", "number"),
    slashUtil.getOption(interaction, "nr5", "number")
  ].filter(v => typeof v !== "undefined") as number[];

  const result = player.marker.mergeItem(idxes);
  if (result === false) {
    await slashUtil.reply(interaction, messages.command["merge_invaild"], true);
    return;
  }

  const actionCountLeft = player.actionCountLeft;
  if (result === null) {
    await slashUtil.reply(interaction, messages.command["merge_fail"](actionCountLeft, maxActionCount), true);
    return;
  }

  await slashUtil.reply(interaction, messages.command["merge_success"](result, actionCountLeft, maxActionCount), true);
}

export default command;
