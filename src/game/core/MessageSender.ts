import { messages, replacePatterns } from "../../data/messageDatas.js";
import Discord from "discord.js";
import type Game from "./Game.js";
import type PlaceableBase from "./PlaceableBase.js";
import type { Damage } from "./StatusManager.js";

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

  async attack(from: string | PlaceableBase, to: PlaceableBase, dmg: Damage) {
    const damageString = messages.game["damage"](dmg);
    return await this.send(`**${typeof from === "string" ? from : from.displayName}** -> ${to.displayName} ${damageString}`);
  }
  
  async turnAlert() {
    const nextTurnPlayer = this.game.getTurnPlayer();
    await this.send(messages.game["turn_alert"](nextTurnPlayer));
  }

  async death(placeable: PlaceableBase) {
    await this.send(messages.game["death"](placeable));
  }

  async errUnexpected() {
    await this.send(messages.err["err_unexpected"]);
  }

  async spawn(owner: PlaceableBase, spawned: PlaceableBase, alertStat?: boolean) {
    await this.send(messages.item["spawn"](owner, spawned, alertStat));
  }

  async winner(winners: PlaceableBase[]) {
    await this.send(messages.game["winner"](winners));
  }

  async gameScreen(highlight?: [x: number, y: number, width: number, height: number]) {
    if (!this.channel) return;
    const canvas = this.game.board.canvas;
    void canvas.render();
    const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(highlight), {
      name: "board.png"
    });
    await this.channel.send({
      content: "** **",
      files: [attachment]
    });
  }
}
