import { createCommand, slashUtil } from "../essentials.js";
import Discord from "discord.js";
import placeable from "../../../bundles/placeable.js";

const command = createCommand("startgame");
command.slashCommand
  .addUserOption(option =>
    option
      .setName("player1")
      .setDescription("wa")
      .setRequired(true)
  )
  .addUserOption(option =>
    option
      .setName("player2")
      .setDescription("!")
      .setRequired(true)
  )
  .addUserOption(option =>
    option
      .setName("player3")
      .setDescription("sans")
  )
  .addUserOption(option =>
    option
      .setName("player4")
      .setDescription("!")
  );
command.handler = async ({ gameManager, guild, channel, interaction }) => {
  if (!interaction.member) {
    await slashUtil.reply(interaction, "Didn't found member...");
    return;
  }

  const playerPlaces = [
    interaction.options.getMember("player1"),
    interaction.options.getMember("player2"),
    interaction.options.getMember("player3"),
    interaction.options.getMember("player4")
  ];
  const guildMemberPlaces: (Discord.GuildMember | null)[] = [];
  for (let i = 0; i < playerPlaces.length; i++) {
    const player = playerPlaces[i];
    if (player === null) {
      guildMemberPlaces.push(null);
    } else if ("user" in player) {
      guildMemberPlaces.push(await guild.members.fetch(player.id));
    } else {
      // TODO: fix this
      guildMemberPlaces.push(null);
    }
  }
  const guildMembers = guildMemberPlaces.filter(v => v) as Discord.GuildMember[];

  const result = gameManager.createGame(guildMembers, channel);
  if (!result) {
    await slashUtil.reply(interaction, "The game is aleady running!");
    return;
  }
  const game = gameManager.getGame(channel.id);
  if (!game) {
    await slashUtil.reply(interaction, "Unexpedted error occured...");
    return;
  }

  try {
    for (let i = 0; i < 4; i++) {
      const guildMember = guildMemberPlaces[i];
      if (!guildMember) continue;
      const x = i % 2 ? 5 : 1;
      const y = i < 2 ? 1 : 5;
      new placeable.main.Player({
        game,
        x, y,
        status: {
          maxHp: 10,
          baseAtk: 2.5,
          baseDef: 0
        },
        memberId: guildMember.id,
        memberName: guildMember.displayName
      });
    }
  } catch {
    await slashUtil.reply(interaction, "Unexpedted error occured...");
    return;
  }

  const canvas = game.board.canvas;
  void canvas.render();
  const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), {
    name: "board.png"
  });
  await slashUtil.reply(interaction, {
    content: "** **",
    files: [attachment]
  });
}

export default command;
