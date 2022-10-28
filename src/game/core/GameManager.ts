import Game from "./Game.js";
import PlayerData from "./PlayerData.js";
import type Discord from "discord.js";

export default class GuildManager {
  client: Discord.Client<boolean>;
  private readonly games: Map<string, Game>;

  constructor(client: Discord.Client<boolean>) {
    this.client = client;
    this.games = new Map();
  }

  createGame(channel: Discord.TextBasedChannel, players: PlayerData[]) {
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

  getGame(channel: Discord.TextBasedChannel) {
    return this.games.get(channel.id);
  }

  destroyGame(channel: Discord.TextBasedChannel) {
    const channelId = channel.id;
    if (this.games.has(channelId)) {
      return false;
    }
    this.games.delete(channelId);
    return true;
  }
}
