import { createCommand, slashUtil } from "../essentials.js";
import { messages } from "../../messageDatas.js";

const command = createCommand("status");

command.handler = async ({ gameManager, channel, interaction, member }) => {
  const game = await slashUtil.getGame(interaction, gameManager, channel);
  if (!game) return;
  const player = game.players.find(p => p.id === member.id);
  if (!player) {
    await slashUtil.reply(interaction, messages.err["err_not_playing"]);
    return;
  }
  
  const marker = player.marker;
  let content = "";
  content += `${messages.game["atk"]} - ${messages.game["damage"](marker.status.getDamage())}\n`;
  content += `${messages.game["def"]} - **${marker.status.getDef()}** 🛡️\n`;
  content += `\n`;
  content += `${messages.game["money"]} - **${player.money}**\n`;
  content += `\n`;
  const items = marker.items;
  if (items.length !== 0) {
    content += `>>> `;
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    content += item.getMinifiedInfo() + "\n";
  }

  await slashUtil.reply(interaction, {
    embeds: [
      {
        author: {
          name: member.displayName,
          icon_url: member.user.avatarURL({
            size: 64,
            extension: "jpg"
          }) ?? undefined
        },
        fields: [
          {
            name: "Your Status",
            value: content
          }
        ],
        color: 0x525252
      }
    ]
  }, true);
};

export default command;
