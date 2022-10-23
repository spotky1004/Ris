import Discord from "discord.js";

type Interaction = Discord.CommandInteraction;

export async function reply(interaction: Interaction, options: string | Discord.InteractionReplyOptions | Discord.MessagePayload) {
  try {
    await interaction.reply(options);
  } catch {}
}

export default {
  reply
}
