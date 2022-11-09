import { createCommand, slashUtil } from "../essentials.js";
import { messages } from "../../messageDatas.js";

const command = createCommand("description");
command.slashCommand
  .addNumberOption(option =>
    option
      .setName("nr")
      .setDescription("No description.")
      .setRequired(true)
  );

command.handler = async ({ gameManager, channel, interaction, member }) => {
  const game = await slashUtil.getGame(interaction, gameManager, channel);
  if (!game) return;
  const player = game.players.find(p => p.id === member.id);
  if (!player) {
    await slashUtil.reply(interaction, messages.err["err_not_playing"]);
    return;
  }

  const idxToUse = slashUtil.getOption(interaction, "nr", "number", true);
  const item = player.marker.items[idxToUse];
  if (!item) {
    await slashUtil.reply(interaction, messages.command["description_fail"], true);
    return;
  }
  const itemInfo = item.data.getInfo();
  await slashUtil.reply(interaction, itemInfo);
}

export default command;
