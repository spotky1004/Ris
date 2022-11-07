import Board, { BoardOptions } from "./Board.js";
import MessageSender from "./MessageSender.js";
import Player from "./Player.js";
import type Discord from "discord.js";
import type GameManager from "./GameManager.js";

interface GameConfig {
  startMoney: number;
  actionCount: number;
}
interface GameOptions {
  gameManager: GameManager;
  board: BoardOptions;
  config: GameConfig;
  players: Player[];
  discordChannel?: Discord.TextBasedChannel;
}

export default class Game {
  readonly gameManager: GameManager;
  messageSender: MessageSender;
  board: Board;
  config: GameConfig;
  players: Player[];
  allTurnCount: number;
  playerTurunCount: number;

  constructor(options: GameOptions) {
    this.gameManager = options.gameManager;
    this.messageSender = new MessageSender(this, options.discordChannel);
    this.board = new Board(this, options.board);
    this.config = options.config;
    this.players = options.players;
    this.allTurnCount = 0;
    this.playerTurunCount = 0;

    options.players.forEach(player => player.connectGame(this));
  }

  getAlivePlayerCount() {
    return this.players.filter(p => !p.defeated).length;
  }

  async turnEnd() {
    // current turn player
    const curTurnPlayer = this.getTurnPlayer();
    if (!curTurnPlayer) {
      await this.messageSender.errUnexpected();
      return;
    }
    const actionDid = curTurnPlayer.actionDid;
    if (
      !actionDid.combine ||
      !actionDid.move
    ) {
      curTurnPlayer.marker.status.attack(1.5, "rule");
    }
    actionDid.combine = false;
    actionDid.move = false;
    const actionCountLeft = curTurnPlayer.actionCountLeft;
    let moneyGot = Math.min(5, Math.max(3, actionCountLeft));
    if (actionCountLeft === 0) moneyGot--;
    /** item event placeholder */
    moneyGot = Math.max(0, moneyGot);
    curTurnPlayer.money += moneyGot;

    // system
    this.addPlayerTurn();

    const canvas = this.board.canvas;
    canvas.clearRenderItems();
    canvas.clearCanvas();
    canvas.renderPlaceables();

    // next turn player
    const nextTurnPlayer = this.getTurnPlayer();
    if (!nextTurnPlayer) {
      await this.messageSender.errUnexpected();
      return;
    }
    let actionCountLeftToSet = this.config.actionCount;
    /** item event placeholder */
    nextTurnPlayer.actionCountLeft = actionCountLeftToSet;
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
