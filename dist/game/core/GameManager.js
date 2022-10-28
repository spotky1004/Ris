import Game from "./Game.js";
export default class GuildManager {
    constructor(discordClient) {
        this.discordClient = discordClient;
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
    getGame(id) {
        return this.games.get(id);
    }
    destroyGame(id) {
        if (this.games.has(id)) {
            return false;
        }
        this.games.delete(id);
        return true;
    }
}
