import Board, { BoardOptions } from "./Board.js";
import MessageSender from "./MessageSender.js";
import type Discord from "discord.js";

interface GameOptions {
  board: BoardOptions;
}

export default class Game {
  channel: Discord.TextBasedChannel;
  sender: MessageSender;
  board: Board;

  constructor(channel: Discord.TextBasedChannel, options: GameOptions) {
    this.channel = channel;
    this.sender = new MessageSender(this);
    this.board = new Board(this, options.board);
  }
}
