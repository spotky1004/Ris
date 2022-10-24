import Discord from "discord.js";
import deployCommand from "./command/functions/deployCommand.js";
import commands from "./bundles/commands.js";
import GuildManager from "./game/core/GameManager.js";
import { token } from "./env.js";

const commandJSON = [...commands.values()].map(c => c.slashCommand.toJSON());
const rest = new Discord.REST({ version: '10' }).setToken(token);
const client = new Discord.Client({
  intents: [
    "MessageContent",
    "GuildMessages",
    "Guilds",
    "GuildMembers",
    "DirectMessages"
  ]
});

const gameManager = new GuildManager(client);

client.on("ready", async () => {
  const guildIds = [...client.guilds.cache.entries()].map(v => v[0]);
  for (const guildId of guildIds) {
    try {
      await deployCommand(
        commandJSON,
        guildId,
        (client.user ?? {}).id as string,
        rest
      );
    } catch {}
  }
  console.log("Ready!");
});

client.on("guildCreate", async (guild) => {
  try {
    await deployCommand(
      commandJSON,
      guild.id,
      (client.user ?? {}).id as string,
      rest
    );
  } catch {}
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand()) {
    const command = commands.get(interaction.commandName);
    if (
      command &&
      interaction.inGuild() &&
      interaction.guild &&
      (
        interaction.channel &&
        interaction.channel.isTextBased()
      ) &&
      interaction.member
    ) {
      command.handler({
        gameManager: gameManager,
        interaction: interaction,
        guild: interaction.guild,
        channel: interaction.channel,
        // @ts-ignore
        member: interaction.member
      });
    }
  }
});

client.login(token);
