import { createCommand, slashUtil } from "../essentials.js";
import { AttachmentBuilder } from "discord.js";
import Canvas from "canvas";
const canvas = Canvas.createCanvas(1000, 1000);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#bde077";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#8eb04a";
ctx.textBaseline = "middle";
ctx.textAlign = "center";
ctx.font = "100px sans-serif";
ctx.fillText("Canvas Test", 500, 500);
const command = createCommand("canvas");
command.handler = async ({ interaction }) => {
    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "canvas.png"
    });
    await slashUtil.reply(interaction, {
        content: "** **",
        files: [attachment]
    });
};
export default command;
