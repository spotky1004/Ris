import Game from "./Game.js";
export default class GuildManager {
    constructor(client) {
        this.client = client;
        this.games = new Map();
    }
    createGame(guild) {
        const guildId = guild.id;
        if (this.games.has(guildId)) {
            return false;
        }
        this.games.set(guildId, new Game(guild, {
            board: {
                size: [7, 7]
            }
        }));
        return true;
    }
    getGame(guild) {
        return this.games.get(guild.id);
    }
    destroyGame(guild) {
        const guildId = guild.id;
        if (this.games.has(guildId)) {
            return false;
        }
        this.games.delete(guildId);
        return true;
    }
}
