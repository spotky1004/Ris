import { createCommand, slashUtil } from "../essentials.js";
import Player from "../../../game/core/Player.js";
import placeable from "../../../bundles/placeable.js";
import { messages } from "../../messageDatas.js";

const command = createCommand("startgame");
command.slashCommand
  .addUserOption(option =>
    option
      .setName("player1")
      .setDescription("Player 1 (required)")
      .setRequired(true)
  )
  .addUserOption(option =>
    option
      .setName("player2")
      .setDescription("Player 2 (required)")
      .setRequired(true)
  )
  .addUserOption(option =>
    option
      .setName("player3")
      .setDescription("Player 3")
  )
  .addUserOption(option =>
    option
      .setName("player4")
      .setDescription("Player 4")
  );

command.handler = async ({ gameManager, guild, channel, interaction }) => {
  if (!interaction.member) {
    await slashUtil.reply(interaction, messages.err["err_member_not_found"]);
    return;
  }
  const playerPlaces = [
    interaction.options.getMember("player1"),
    interaction.options.getMember("player2"),
    interaction.options.getMember("player3"),
    interaction.options.getMember("player4")
  ];
  const playerDataPlaces: (Player | null)[] = [];
  for (let i = 0; i < playerPlaces.length; i++) {
    const player = playerPlaces[i];
    if (player === null) {
      playerDataPlaces.push(null);
    } else if ("user" in player) {
      const guildMember = await guild.members.fetch(player.id);
      const playerData = new Player({
        id: guildMember.id,
        displayName: guildMember.displayName
      });
      playerDataPlaces.push(playerData);
    } else {
      // TODO: fix this
      playerDataPlaces.push(null);
    }
  }
  const playerDatas = playerDataPlaces.filter(v => v) as Player[];

  const result = gameManager.createGame(playerDatas, channel);
  if (!result) {
    await slashUtil.reply(interaction, messages.err["err_game_running"]);
    return;
  }
  const game = gameManager.getGame(channel.id);
  if (!game) {
    await slashUtil.reply(interaction, messages.err["err_unexpected"], true);
    return;
  }

  try {
    for (let i = 0; i < 4; i++) {
      const playerData = playerDataPlaces[i];
      if (!playerData) continue;
      const x = i % 2 ? 5 : 1;
      const y = i < 2 ? 1 : 5;
      const player = new placeable.main.PlayerMarker({
        game, player: playerData,
        x, y,
        status: {
          maxHp: 10,
          baseDamage: {
            normal: 2.5
          },
        },
        memberId: playerData.id,
        memberName: playerData.displayName
      });
      playerData.connectMarker(player);
    }
  } catch {
    await slashUtil.reply(interaction, messages.err["err_unexpected"]);
    return;
  }

  await game.messageSender.turnAlert();

  await slashUtil.reply(interaction, messages.command["startgame"](game));
  await game.messageSender.gameScreen();
}

export default command;
