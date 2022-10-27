import Board, { BoardOptions } from "./Board.js";
import MessageSender from "./MessageSender.js";
import type Discord from "discord.js";

const maxPlayerCount = 4;
interface GameOptions {
  board: BoardOptions;
}

export default class Game {
  channel: Discord.TextBasedChannel;
  sender: MessageSender;
  board: Board;
  players: (Discord.GuildMember | Discord.APIInteractionGuildMember)[];

  constructor(
    channel: Discord.TextBasedChannel,
    playerList: (Discord.GuildMember | Discord.APIInteractionGuildMember)[],
    options: GameOptions
  ) {
    this.channel = channel;
    this.sender = new MessageSender(this);
    this.board = new Board(this, options.board);

    this.players = [];
    for (let i = 0; i < Math.min(maxPlayerCount, playerList.length); i++) {
      while (true) {
        const picked = playerList[Math.floor(playerList.length * Math.random())];
        if (this.players.includes(picked)) continue;
        this.players.push(picked);
        break;
      }
    }
  }
}
