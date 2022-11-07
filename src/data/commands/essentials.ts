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



interface SlashUtilGetOptionsTypeEnum {
  "string": string;
  "number": number;
  "boolean": boolean;
  "member": Discord.GuildMember | Discord.APIInteractionDataResolvedGuildMember | null;
  "user": Discord.User | null;
}

export const slashUtil = {
  reply: async function(
    interaction: Discord.CommandInteraction,
    options: string | Discord.InteractionReplyOptions,
    ephemeral: boolean = false
  ) {
    try {
      if (typeof options === "string") {
        await interaction.reply({
          content: options,
          ephemeral
        });
      } else {
        await interaction.reply({
          ephemeral,
          ...options
        });
      }
    } catch {}
  },
  getOption: function<T extends keyof SlashUtilGetOptionsTypeEnum, U extends boolean=false>(
    interaction: Discord.CommandInteraction,
    name: string,
    type: T,
    required?: U
    // @ts-ignore
  ): SlashUtilGetOptionsTypeEnum[T] | (U extends true ? never : undefined) {
    let value: SlashUtilGetOptionsTypeEnum[T] | (U extends true ? never : undefined) | null;
    if (type === "number" || type === "string" || type === "boolean") {
      // @ts-ignore
      value = interaction.options.get(name);
      if (required && value === null) {
        throw new Error(`While get slash command option: ${name}.\nIt was required, but got null.`);
      }
    } else if (type === "user") {
      // @ts-ignore
      value = interaction.options.getUser(name);
    } else if (type === "member") {
      // @ts-ignore
      value = interaction.options.getMember(name);
    }
    
    // @ts-ignore
    return value;
  }
}

