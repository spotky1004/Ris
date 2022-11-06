import { messages, replacePatterns } from "../../data/messageDatas.js";
import Discord from "discord.js";
import type Game from "./Game.js";
import type PlaceableBase from "./PlaceableBase.js";

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
    return await this.send(messages.game["attack"](from, to, dmg));
  }
  
  async turnAlert() {
    const nextTurnPlayer = this.game.getTurnPlayer();
    if (nextTurnPlayer) {
      await this.send(messages.game["turn_alert"](nextTurnPlayer));
    } else {
      await this.errUnexpected();
    }
  }

  async errUnexpected() {
    await this.send(messages.err["err_unexpected"]());
  }

  async gameScreen() {
    if (!this.channel) return;
    const canvas = this.game.board.canvas;
    void canvas.render();
    const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), {
      name: "board.png"
    });
    await this.channel.send({
      content: "** **",
      files: [attachment]
    });
  }
}
