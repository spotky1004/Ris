import Board, { BoardOptions } from "./Board.js";
import MessageSender from "./MessageSender.js";
import PlayerData from "./PlayerData.js";
import type Discord from "discord.js";

interface GameOptions {
  board: BoardOptions;
  players: PlayerData[];
  discordChannel?: Discord.TextBasedChannel;
}

export default class Game {
  messageSender: MessageSender;
  board: Board;
  players: PlayerData[];

  constructor(options: GameOptions) {
    this.messageSender = new MessageSender(this, options.discordChannel);
    this.board = new Board(this, options.board);

    this.players = options.players;
  }
}
