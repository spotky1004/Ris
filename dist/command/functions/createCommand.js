import Discord from "discord.js";
export default function createCommand(name, paramRoleId) {
    return {
        commandName: name,
        handler: async () => { },
        slashCommand: new Discord.SlashCommandBuilder()
            .setName(name)
            .setDescription("No description..."),
        permRoleId: paramRoleId !== null && paramRoleId !== void 0 ? paramRoleId : null,
        ephemeral: false
    };
}
