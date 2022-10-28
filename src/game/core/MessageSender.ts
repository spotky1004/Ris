import replacePatterns from "../../data/replacePatterns.js";
import type Game from "./Game.js";
import type PlaceableBase from "./PlaceableBase.js";
import type Discord from "discord.js";

export default class MessageSender {
  // @ts-ignore
  private game: Game;
  channel: Discord.TextBasedChannel | undefined;
  readonly messageLog: string[];

  constructor(game: Game, channel?: Discord.TextBasedChannel) {
    this.game = game;
    this.channel = channel;
    this.messageLog = [];
  }

  async send(msg: string) {
    for (const [pattern, replacer] of replacePatterns) {
      msg.replace(pattern, replacer);
    }
    this.messageLog.push(msg);

    if (!this.channel) return;
    try {
      await this.channel.send(msg);
      return true;
    } catch {}
    return false;
  }

  async attack(from: PlaceableBase, to: PlaceableBase, dmg: number) {
    return await this.send(`**${from.displayName}** attacked **${to.displayName}** with **${dmg}** $DMG`);
  }
}
