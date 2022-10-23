import type Discord from "discord.js";
import Game from "./Game.js";

export default class GuildManager {
  client: Discord.Client<boolean>;
  private readonly games: Map<string, Game>;

  constructor(client: Discord.Client<boolean>) {
    this.client = client;
    this.games = new Map();
  }

  createGame(guild: Discord.Guild) {
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

  getGame(guild: Discord.Guild) {
    return this.games.get(guild.id);
  }

  destroyGame(guild: Discord.Guild) {
    const guildId = guild.id;
    if (this.games.has(guildId)) {
      return false;
    }
    this.games.delete(guildId);
    return true;
  }
}
