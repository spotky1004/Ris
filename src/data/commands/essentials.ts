import Discord from "discord.js";
import type GameManager from "../../game/core/GameManager.js";

interface CommandHandlerArgs {
  interaction: Discord.CommandInteraction;
  gameManager: GameManager;
  guild: Discord.Guild;
  channel: Discord.TextBasedChannel;
  member: Discord.GuildMember;
}

type CommandHandler = (args: CommandHandlerArgs) => void | Promise<void>;

export interface CommandData {
  commandName: string;
  slashCommand: Discord.SlashCommandBuilder | Omit<Discord.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  handler: CommandHandler;
  ephemeral: boolean;
}

export function createCommand(name: string): CommandData {
  return {
    commandName: name,
    handler: async () => {},
    slashCommand: new Discord.SlashCommandBuilder()
      .setName(name)
      .setDescription("No description..."),
    ephemeral: false
  }
}



type Interaction = Discord.CommandInteraction;

export const slashUtil = {
  reply: async function(interaction: Interaction, options: string | Discord.InteractionReplyOptions | Discord.MessagePayload) {
    try {
      await interaction.reply(options);
    } catch {}
  }
}

