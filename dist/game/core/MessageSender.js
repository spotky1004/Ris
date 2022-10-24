import replacePatterns from "../../data/replacePatterns.js";
export default class MessageSender {
    constructor(game) {
        this.game = game;
    }
    async send(msg) {
        const channel = this.game.channel;
        for (const [pattern, replacer] of replacePatterns) {
            msg.replace(pattern, replacer);
        }
        try {
            await channel.send(msg);
            return true;
        }
        catch (_a) { }
        return false;
    }
    async attack(from, to, dmg) {
        return await this.send(`**${from.displayName}** attacked **${to.displayName}** with **${dmg}** $DMG`);
    }
}
