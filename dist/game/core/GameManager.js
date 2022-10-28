import Game from "./Game.js";
export default class GuildManager {
    constructor(client) {
        this.client = client;
        this.games = new Map();
    }
    createGame(players, discordChannel) {
        const channelId = discordChannel ? discordChannel.id : "game";
        if (this.games.has(channelId)) {
            return false;
        }
        this.games.set(channelId, new Game({
            board: {
                size: [7, 7],
            },
            discordChannel,
            players
        }));
        return true;
    }
    getGame(channel) {
        return this.games.get(channel.id);
    }
    destroyGame(channel) {
        const channelId = channel.id;
        if (this.games.has(channelId)) {
            return false;
        }
        this.games.delete(channelId);
        return true;
    }
}
