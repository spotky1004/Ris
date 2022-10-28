import Board, { BoardOptions } from "./Board.js";
import MessageSender from "./MessageSender.js";
import PlayerData from "./PlayerData.js";
import type Discord from "discord.js";

interface GameOptions {
  board: BoardOptions;
}

export default class Game {
  channel: Discord.TextBasedChannel;
  messageSender: MessageSender;
  board: Board;
  players: PlayerData[];

  constructor(channel: Discord.TextBasedChannel, playerList: PlayerData[], options: GameOptions) {
    this.channel = channel;
    this.messageSender = new MessageSender(this);
    this.board = new Board(this, options.board);

    this.players = playerList;
  }
}
