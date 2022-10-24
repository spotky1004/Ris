import Discord from "discord.js";
import type GameManager from "../../game/core/GameManager.js";

interface CommandHandlerArgs {
  interaction: Discord.CommandInteraction;
  gameManager: GameManager;
  guild: Discord.Guild;
  channel: Discord.TextBasedChannel;
  member: Discord.GuildMember;
}

type CommandHandler = (args: CommandHandlerArgs) => Promise<void>;

export interface CommandData {
  commandName: string;
  slashCommand: Discord.SlashCommandBuilder | Omit<Discord.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  handler: CommandHandler;
  ephemeral: boolean;
}

export default function createCommand(name: string): CommandData {
  return {
    commandName: name,
    handler: async () => {},
    slashCommand: new Discord.SlashCommandBuilder()
      .setName(name)
      .setDescription("No description..."),
    ephemeral: false
  }
}
