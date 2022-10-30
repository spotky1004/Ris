import { createCommand, slashUtil } from "../essentials.js";
import { messages } from "../../messageDatas.js";

const command = createCommand("move");
command.slashCommand
  .addStringOption(option =>
    option
      .setName("directions")
      .setDescription("LRUD")
      .setRequired(true)
  );

const directions: { [K in "L" | "R" | "U" | "D"]: [x: number, y: number] } = {
  "L": [-1, 0], "R": [1, 0],
  "U": [0, -1], "D": [0, 1]
};
function isDirectionCharacter(char: string): char is "L" | "R" | "U" | "D" {
  return ["L", "R", "U", "D"].includes(char);
}
const MAX_MOVE_COUNT = 4;
command.handler = async ({ gameManager, interaction, member, channel }) => {
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
  const input = (interaction.options.get("directions", true).value ?? "") as string;
  const moveDirections: [x: number, y: number][] = [];
  for (const char of Array.from(input.toUpperCase())) {
    if (isDirectionCharacter(char)) {
      moveDirections.push(directions[char]);
    } else {
      await slashUtil.reply(interaction, messages.game["invaild_move"]());
      return;
    }
  }
  if (moveDirections.length > MAX_MOVE_COUNT) {
    await slashUtil.reply(interaction, messages.game["action_count_exceeded"](MAX_MOVE_COUNT, MAX_MOVE_COUNT));
    return;
  }
  
  for (const [dx, dy] of moveDirections) {
    player.marker.move(dx, dy);
  }
  await slashUtil.reply(interaction, {
    content: messages.etc["done"](),
    ephemeral: true
  });
  game.addPlayerTurn();

  const nextPlayerMarker = game.getTurnPlayer()?.marker;
  if (nextPlayerMarker) {
    await game.messageSender.send(messages.game["turn_alert"](nextPlayerMarker));
  } else {
    await game.messageSender.send(messages.err["err_unexpected"]());
  }
  await game.messageSender.gameScreen();
}

export default command;
