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
  allTurnCount: number;
  playerTurunCount: number;

  constructor(options: GameOptions) {
    this.messageSender = new MessageSender(this, options.discordChannel);
    this.board = new Board(this, options.board);
    this.players = options.players;
    this.allTurnCount = 0;
    this.playerTurunCount = 0;
  }

  getAlivePlayerCount() {
    return this.players.filter(p => !p.defeated).length;
  }

  getTurnPlayer() {
    let playerAcc = 0;
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (playerAcc === this.playerTurunCount) {
        return player;
      }
      if (!player.defeated) playerAcc++;
    }
    return null;
  }

  addPlayerTurn() {
    const canvas = this.board.canvas;
    
    // init canvas
    canvas.clearRenderItems();
    canvas.clearCanvas();
    canvas.renderPlaceables();

    // increment turn
    this.playerTurunCount++;
    if (this.playerTurunCount === this.getAlivePlayerCount()) {
      this.playerTurunCount = 0;
      this.allTurnCount++;
    }
    return this.playerTurunCount;
  }
}
