import Board, { BoardOptions } from "./Board.js";
import MessageSender from "./MessageSender.js";
import Player from "./Player.js";
import type Discord from "discord.js";
import type GameManager from "./GameManager.js";
import type { TickTypes } from "../util/TickManager.js";

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
    const actionDid = curTurnPlayer.actionDid;
    if (
      !actionDid.combine ||
      !actionDid.move
    ) {
      curTurnPlayer.marker.status.attack(1.5, "rule");
      this.messageSender.ruleDamage(curTurnPlayer.marker, 1.5);
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
    this.emitPlayerTurnTick();
    let actionCountLeftToSet = this.config.actionCount;
    /** item event placeholder */
    nextTurnPlayer.actionCountLeft = actionCountLeftToSet;
    await this.messageSender.turnAlert();

    return {
      moneyGot
    };
  }

  getTurnPlayer() {
    const alivePlayerCount = this.getAlivePlayerCount();
    if (this.playerTurunCount >= alivePlayerCount) {
      this.playerTurunCount = alivePlayerCount - 1;
    }

    let playerAcc = 0;
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (playerAcc === this.playerTurunCount) {
        return player;
      }
      if (!player.defeated) playerAcc++;
    }
    throw new Error("Can't get turn player.\nIt might be the game is ended.");
  }

  addPlayerTurn() {
    this.playerTurunCount++;
    if (this.playerTurunCount === this.getAlivePlayerCount()) {
      this.playerTurunCount = 0;
      this.allTurnCount++;
      this.emitAllTurnTick();
    }
    return this.playerTurunCount;
  }

  private emitTick(player: Player, type: TickTypes) {
    player.marker.items.forEach(item => {
      item.chargeTick.tick(type);
    });
  }
  
  emitMoveTick(player?: Player) {
    if (!player) {
      const turnPlayer = this.getTurnPlayer();
      player = turnPlayer;
    }
    this.emitTick(player, "move");
  }

  emitPlayerTurnTick(player?: Player) {
    if (!player) {
      const turnPlayer = this.getTurnPlayer();
      player = turnPlayer;
    }
    this.emitTick(player, "playerTurn");
  }

  emitAllTurnTick(player?: Player) {
    if (!player) {
      for (const player of this.players) {
        this.emitTick(player, "allTurn");
      }
    } else {
      this.emitTick(player, "allTurn");
    }
  }
}
