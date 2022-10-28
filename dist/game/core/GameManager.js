import Game from "./Game.js";
export default class GuildManager {
    constructor(client) {
        this.client = client;
        this.games = new Map();
    }
    createGame(channel, players) {
        const channelId = channel.id;
        if (this.games.has(channelId)) {
            return false;
        }
        this.games.set(channelId, new Game(channel, {
            players,
            board: {
                size: [7, 7],
            }
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
