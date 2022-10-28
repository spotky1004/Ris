import createCommand from "../functions/createCommand.js";
import slashUtil from "../functions/slashUtil.js";
import { AttachmentBuilder } from "discord.js";
import Player from "../../data/placeables/main/Player.js";
const command = createCommand("startgame");
command.handler = async ({ gameManager, guild, channel, interaction }) => {
    if (!interaction.member) {
        await slashUtil.reply(interaction, "Didn't found member...");
        return;
    }
    const member = await guild.members.fetch(interaction.user.id);
    const result = gameManager.createGame([member], channel);
    if (!result) {
        await slashUtil.reply(interaction, "The game is aleady running!");
        return;
    }
    const game = gameManager.getGame(channel.id);
    if (!game) {
        await slashUtil.reply(interaction, "Unexpedted error occured...");
        return;
    }
    try {
        new Player({
            game,
            x: 3, y: 3,
            status: {
                maxHp: 10,
                baseAtk: 2.5,
                baseDef: 0
            },
            memberId: interaction.user.id,
            memberName: member.displayName
        });
    }
    catch (_a) {
        await slashUtil.reply(interaction, "Unexpedted error occured...");
        return;
    }
    const canvas = game.board.canvas;
    void canvas.render();
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "board.png"
    });
    await slashUtil.reply(interaction, {
        content: "** **",
        files: [attachment]
    });
};
export default command;
