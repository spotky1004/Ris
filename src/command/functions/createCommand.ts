import Discord from "discord.js";
import type GameManager from "../../game/core/GameManager.js";

interface CommandHandlerOptions {
  interaction: Discord.CommandInteraction;
  gameManager: GameManager;
  guild: Discord.Guild;
  member: Discord.GuildMember;
}

type CommandHandler = (options: CommandHandlerOptions) => Promise<void>;

export interface CommandData {
  commandName: string;
  slashCommand: Discord.SlashCommandBuilder | Omit<Discord.SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  handler: CommandHandler;
  permRoleId: string | null;
  ephemeral: boolean;
}

export default function createCommand(name: string, paramRoleId?: string): CommandData {
  return {
    commandName: name,
    handler: async () => {},
    slashCommand: new Discord.SlashCommandBuilder()
      .setName(name)
      .setDescription("No description..."),
    permRoleId: paramRoleId ?? null,
    ephemeral: false
  }
}
