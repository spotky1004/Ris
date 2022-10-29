import Discord from "discord.js";

export default async function deployCommand(
  commands: ReturnType<Discord.SlashCommandBuilder["toJSON"]>[],
  guildId: string,
  clientId: string,
  rest: Discord.REST
) {
  try {
    const data = await rest.put(Discord.Routes.applicationGuildCommands(clientId, guildId), { body: commands }) as any;
    console.log(`Deploied ${data.length} commands!`);
  } catch (e) {
    throw new Error(e as any);
  }
}
