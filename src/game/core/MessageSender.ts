import replacePatterns from "../../data/replacePatterns.js";
import type Game from "./Game.js";
import type PlaceableBase from "../placeables/PlaceableBase.js";

export default class MessageSender {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  async send(msg: string) {
    const channel = this.game.channel;
    for (const [pattern, replacer] of replacePatterns) {
      msg.replace(pattern, replacer);
    }
    try {
      await channel.send(msg);
      return true;
    } catch {}
    return false;
  }

  async attack(from: PlaceableBase, to: PlaceableBase, dmg: number) {
    return await this.send(`**${from.displayName}** attacked **${to.displayName}** with **${dmg}** $DMG`);
  }
}
