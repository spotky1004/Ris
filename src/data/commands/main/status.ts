import { createCommand, slashUtil } from "../essentials.js";
import { messages } from "../../messageDatas.js";

const command = createCommand("status");

command.handler = async ({ gameManager, channel, interaction, member }) => {
  const game = gameManager.getGame(channel.id);
  if (!game) {
    await slashUtil.reply(interaction, messages.err["err_game_not_started"]);
    return;
  }

  const player = game.players.find(p => p.id === member.id);
  if (!player) {
    await slashUtil.reply(interaction, messages.err["err_not_playing"]);
    return;
  }
  const marker = player.marker;
  let content = "";
  content += `${messages.game["atk"]} - **${marker.status.getAtk()}** ⚔️\n`;
  content += `${messages.game["def"]} - **${marker.status.getDef()}** 🛡️\n`;
  content += `\n`;
  content += `${messages.game["money"]} - **${player.money}**\n`;
  content += `\n`;
  const items = marker.items;
  if (items.length !== 0) {
    content += `> `;
  }
  for (let i = 0; i < items.length; i++) {
    const workingItem = items[i];
    const item = workingItem.data;
    const itemValue = `[${item.cost}, ${messages.item["tier_order"][item.tier]}]`;
    const chargeLen = item.chargeOptions?.length ?? 0;
    content += `\`#${i.toString().padStart(2, " ")}\` - **${item.name}** **${itemValue}** ${chargeLen > 0 ? `(CD: **${workingItem.chargeTick.timeLeft}**/${chargeLen})`: ""}`;
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
