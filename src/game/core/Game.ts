import Board, { BoardOptions } from "./Board.js";
import type Discord from "discord.js";

interface GameOptions {
  board: BoardOptions;
}

export default class Game {
  guild: Discord.Guild;
  board: Board;

  constructor(guild: Discord.Guild, options: GameOptions) {
    this.guild = guild;
    this.board = new Board(this, options.board);
  }
}
