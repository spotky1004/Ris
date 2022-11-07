import Game from "./Game.js";
import Player from "./Player.js";
import type Discord from "discord.js";

export default class GuildManager {
  discordClient: Discord.Client<boolean> | undefined;
  private readonly games: Map<string, Game>;

  constructor(discordClient?: Discord.Client<boolean>) {
    this.discordClient = discordClient;
    this.games = new Map();
  }

  createGame(players: Player[], discordChannel?: Discord.TextBasedChannel) {
    const channelId = discordChannel ? discordChannel.id : "game";
    if (this.games.has(channelId)) {
      return false;
    }
    
    this.games.set(channelId, new Game({
      config: {
        startMoney: 4,
        actionCount: 5
      },
      board: {
        size: [7, 7],
      },
      discordChannel,
      players
    }));
    return true;
  }

  getGame(id: string) {
    return this.games.get(id);
  }

  destroyGame(id: string) {
    if (this.games.has(id)) {
      return false;
    }
    this.games.delete(id);
    return true;
  }
}
