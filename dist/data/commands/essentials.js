import Discord from "discord.js";
export function createCommand(name) {
    return {
        commandName: name,
        handler: async () => { },
        slashCommand: new Discord.SlashCommandBuilder()
            .setName(name)
            .setDescription("No description..."),
        ephemeral: false
    };
}
export const slashUtil = {
    reply: async function (interaction, options) {
        try {
            await interaction.reply(options);
        }
        catch (_a) { }
    }
};
