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
  .addStringOption(option =>
    option
      .setName("param1")
      .setDescription("No description.")
  )
  .addStringOption(option =>
    option
      .setName("param2")
      .setDescription("No description.")
  )
  .addStringOption(option =>
    option
      .setName("param3")
      .setDescription("No description.")
  )
  .addStringOption(option =>
    option
      .setName("param4")
      .setDescription("No description.")
  )
  .addStringOption(option =>
    option
      .setName("param5")
      .setDescription("No description.")
  );

command.handler = async ({ gameManager, channel, interaction, member }) => {
  const game = await slashUtil.getGame(interaction, gameManager, channel);
  if (!game) return;
  const player = await slashUtil.getCurPlayer(interaction, game, member);
  if (!player) return;

  if (player.actionCountLeft < 1) {
    await slashUtil.reply(interaction, messages.game["action_count_exceeded"](player.actionCountLeft, game.config.actionCount), true);
    return;
  }

  const idxToUse = slashUtil.getOption(interaction, "nr", "number", true);
  const itemParams = [
    slashUtil.getOption(interaction, "param1", "string") ?? "",
    slashUtil.getOption(interaction, "param2", "string") ?? "",
    slashUtil.getOption(interaction, "param3", "string") ?? "",
    slashUtil.getOption(interaction, "param4", "string") ?? "",
    slashUtil.getOption(interaction, "param5", "string") ?? "",
  ];
  const useResult = await player.marker.useItem(idxToUse, itemParams);
  if (!useResult) {
    await slashUtil.reply(interaction, messages.command["use_fail"], true);
    return;
  }
  const [item, result] = useResult;
  if (result.errorMsg) {
    await slashUtil.reply(interaction, "Wrong param: " + useResult[1].errorMsg, true);
    return;
  }
  
  let relpyMsg = messages.command["use_success"](item.data, player.actionCountLeft, game.config.actionCount);
  if (result.replyMsg) {
    relpyMsg = result.replyMsg + "\n" + "-".repeat(50) + "\n" + relpyMsg;
  }
  await slashUtil.reply(interaction, relpyMsg, true);
}

export default command;
