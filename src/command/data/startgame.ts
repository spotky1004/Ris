import createCommand from "../functions/createCommand.js";
import slashUtil from "../functions/slashUtil.js";
import { AttachmentBuilder } from "discord.js";
import Player from "../../game/placeables/Player.js";

const command = createCommand("startgame");
command.handler = async ({ gameManager, guild, channel, interaction }) => {
  const result = gameManager.createGame(channel);
  if (!result) {
    await slashUtil.reply(interaction, "The game is aleady running!");
    return;
  }
  const game = gameManager.getGame(channel);
  if (!game) {
    await slashUtil.reply(interaction, "Unexpedted error occured...");
    return;
  }

  try {
    const member = await guild.members.fetch(interaction.user.id);
    new Player({
      game,
      x: 3, y: 3,
      status: {
        maxHp: 10,
        baseAtk: 2.5,
        baseDef: 0
      },
      memberId: interaction.user.id,
      memberName: member.displayName
    });
  } catch {
    await slashUtil.reply(interaction, "Unexpedted error occured...");
    return;
  }

  const canvas = game.board.canvas;
  void canvas.render();
  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: "board.png"
  });
  await slashUtil.reply(interaction, {
    content: "** **",
    files: [attachment]
  });
}

export default command;
