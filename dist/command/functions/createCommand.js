import Discord from "discord.js";
export default function createCommand(name) {
    return {
        commandName: name,
        handler: async () => { },
        slashCommand: new Discord.SlashCommandBuilder()
            .setName(name)
            .setDescription("No description..."),
        ephemeral: false
    };
}
