import Discord from "discord.js";
export default async function deployCommand(commands, guildId, clientId, rest) {
    try {
        const data = await rest.put(Discord.Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log(`Deploied ${data.length} commands!`);
    }
    catch (e) {
        throw new Error(e);
    }
}
