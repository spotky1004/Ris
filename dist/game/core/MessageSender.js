import { messages, replacePatterns } from "../../data/messageDatas.js";
export default class MessageSender {
    constructor(game, channel) {
        this.game = game;
        this.channel = channel;
        this.messageLog = [];
    }
    async send(msg) {
        for (const [pattern, replacer] of replacePatterns) {
            msg.replace(pattern, replacer);
        }
        this.messageLog.push(msg);
        if (!this.channel)
            return;
        try {
            await this.channel.send(msg);
            return true;
        }
        catch (_a) { }
        return false;
    }
    async attack(from, to, dmg) {
        return await this.send(messages.attack(from, to, dmg));
    }
}
