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
command.handler = async ({ gameManager, interaction, member, channel }) => {
  const game = await slashUtil.getGame(interaction, gameManager, channel);
  if (!game) return;
  const player = await slashUtil.getCurPlayer(interaction, game, member);
  if (!player) return;

  const actionCountLeft = player.actionCountLeft;
  const input = slashUtil.getOption(interaction, "directions", "string", true);
  const moveDirections: [x: number, y: number][] = [];
  for (const char of Array.from(input.toUpperCase())) {
    if (isDirectionCharacter(char)) {
      moveDirections.push(directions[char]);
    } else {
      await slashUtil.reply(interaction, messages.game["invaild_move"], true);
      return;
    }
  }
  if (moveDirections.length > actionCountLeft) {
    await slashUtil.reply(interaction, messages.game["action_count_exceeded"](actionCountLeft, game.config.actionCount), true);
    return;
  }
  
  let moved = false;
  for (const [dx, dy] of moveDirections) {
    const result = player.marker.move(dx, dy);
    moved = result.moveSuccess || moved;
    if (result.attack) break;
  }
  if (!moved) {
    await slashUtil.reply(interaction, messages.game["invaild_move"], true);
    return;
  }
  
  const result = await game.turnEnd();
  await slashUtil.reply(interaction, messages.game["turn_end"](result.moneyGot), true);

  await game.messageSender.gameScreen();
}

export default command;
