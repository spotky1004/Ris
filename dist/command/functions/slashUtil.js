export async function reply(interaction, options) {
    try {
        await interaction.reply(options);
    }
    catch (_a) { }
}
export default {
    reply
};
