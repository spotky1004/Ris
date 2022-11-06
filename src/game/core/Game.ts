import Board, { BoardOptions } from "./Board.js";
import MessageSender from "./MessageSender.js";
import PlayerData from "./PlayerData.js";
import type Discord from "discord.js";

interface GameConfig {
  startMoney: number;
  actionCount: number;
}
interface GameOptions {
  board: BoardOptions;
  config: GameConfig;
  players: PlayerData[];
  discordChannel?: Discord.TextBasedChannel;
}

export default class Game {
  messageSender: MessageSender;
  board: Board;
  config: GameConfig;
  players: PlayerData[];
  allTurnCount: number;
  playerTurunCount: number;

  constructor(options: GameOptions) {
    this.messageSender = new MessageSender(this, options.discordChannel);
    this.board = new Board(this, options.board);
    this.config = options.config;
    this.players = options.players;
    this.allTurnCount = 0;
    this.playerTurunCount = 0;
  }

  getAlivePlayerCount() {
    return this.players.filter(p => !p.defeated).length;
  }

  async turnEnd() {
    // current turn player
    const curTurnPlayer = this.getTurnPlayer();
    const curTurnPlayerMarker = curTurnPlayer?.marker;
    if (!curTurnPlayer || !curTurnPlayerMarker) {
      await this.messageSender.errUnexpected();
      return;
    }
    const actionCountLeft = curTurnPlayerMarker.actionCountLeft;
    let moneyGot = Math.min(5, Math.max(3, actionCountLeft));
    if (actionCountLeft === 0) moneyGot--;
    /** item event placeholder */
    moneyGot = Math.max(0, moneyGot);
    curTurnPlayerMarker.money += moneyGot;

    // system
    this.addPlayerTurn();

    const canvas = this.board.canvas;
    canvas.clearRenderItems();
    canvas.clearCanvas();
    canvas.renderPlaceables();

    // next turn player
    const nextTurnPlayer = this.getTurnPlayer();
    const nextPlayerMarker = nextTurnPlayer?.marker;
    if (!nextTurnPlayer || !nextPlayerMarker) {
      await this.messageSender.errUnexpected();
      return;
    }
    let actionCountLeftToSet = this.config.actionCount;
    /** item event placeholder */
    nextPlayerMarker.actionCountLeft = actionCountLeftToSet;
    await this.messageSender.turnAlert();
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
    // increment turn
    this.playerTurunCount++;
    if (this.playerTurunCount === this.getAlivePlayerCount()) {
      this.playerTurunCount = 0;
      this.allTurnCount++;
    }
    return this.playerTurunCount;
  }
}
