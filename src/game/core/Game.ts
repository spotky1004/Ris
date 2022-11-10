import Board, { BoardOptions } from "./Board.js";
import MessageSender from "./MessageSender.js";
import Player from "./Player.js";
import type Discord from "discord.js";
import type GameManager from "./GameManager.js";
import type { TickTypes } from "../util/TickManager.js";
import type {
  GameEventNames,
  GameEventData,
  ItemGameEventReturn,
  StatusEffectGameEventReturn
} from "@typings/GameEvent";

interface GameConfig {
  startMoney: number;
  actionCount: number;
}
interface GameOptions {
  id: string;
  gameManager: GameManager;
  board: BoardOptions;
  config: GameConfig;
  players: Player[];
  discordChannel?: Discord.TextBasedChannel;
}

export default class Game {
  readonly gameManager: GameManager;
  readonly id: string;
  messageSender: MessageSender;
  board: Board;
  config: GameConfig;
  players: Player[];
  allTurnCount: number;
  playerTurunCount: number;

  constructor(options: GameOptions) {
    this.gameManager = options.gameManager;
    this.id = options.id;
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
    this.emitEvent("playerTurnEnd", "before", {
      target: curTurnPlayer
    });
    const actionDid = curTurnPlayer.actionDid;
    if (
      !actionDid.merge ||
      !actionDid.move
    ) {
      await curTurnPlayer.marker.attackedBy("Rule Damage", {
        rule: 1.5
      })
    }
    actionDid.merge = false;
    actionDid.move = false;
    const actionCountLeft = curTurnPlayer.actionCountLeft;
    let moneyGot = Math.min(5, Math.max(3, actionCountLeft));
    if (actionCountLeft === 0) moneyGot--;
    /** event placeholder */
    moneyGot = Math.max(0, moneyGot);
    curTurnPlayer.money += moneyGot;
    this.emitEvent("playerTurnEnd", "after", {
      target: curTurnPlayer
    });

    // system
    this.addPlayerTurn();

    const canvas = this.board.canvas;
    canvas.clearRenderItems();
    canvas.clearCanvas();
    canvas.renderPlaceables();

    // next turn player
    const nextTurnPlayer = this.getTurnPlayer();
    this.emitEvent("playerTurnEnd", "before", {
      target: nextTurnPlayer
    });
    this.emitPlayerTurnTick();
    let actionCountLeftToSet = this.config.actionCount;
    /** event placeholder */
    nextTurnPlayer.actionCountLeft = actionCountLeftToSet;
    await this.messageSender.turnAlert();
    this.emitEvent("playerTurnEnd", "after", {
      target: nextTurnPlayer
    });

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
      this.emitEvent("allTurnEnd", "before", {
        target: this.getTurnPlayer()
      });
      this.playerTurunCount = 0;
      this.allTurnCount++;
      this.emitAllTurnTick();
      this.emitEvent("allTurnEnd", "after", {
        target: this.getTurnPlayer()
      });
      this.emitEvent("allTurnStart", "before", {
        target: this.getTurnPlayer()
      });
      this.emitEvent("allTurnStart", "after", {
        target: this.getTurnPlayer()
      });
    }
    return this.playerTurunCount;
  }

  gameEnd() {
    const winners = this.board.getAllPlaceables();
    this.messageSender.winner(winners);
    this.gameManager.destroyGame(this.id)
  }

  async emitEvent<T extends GameEventNames>(type: T, timing: "before" | "after", data: GameEventData[T], player?: Player): Promise<[ItemGameEventReturn[T][], StatusEffectGameEventReturn[T][]]> {
    let alivePlayers = this.players.filter(p => !p.defeated);
    if (player) alivePlayers = alivePlayers.filter(p => p === player);
    
    const returnVals: [ItemGameEventReturn[T][], StatusEffectGameEventReturn[T][]] = [[], []];
    for (const player of alivePlayers) {
      const [itemReturnVals, effectReturnVals] = await player.marker.emitEvent(type, timing, data);
      returnVals[0].push(...itemReturnVals);
      returnVals[1].push(...effectReturnVals);
    }

    const merged = [...returnVals[0], ...returnVals[1]];
    merged.sort((a, b) => (a.perioty ?? 1) - (b.perioty ?? 1));
    for (const returnVal of merged) {
      const { message } = returnVal;
      if (message) {
        this.messageSender.send(message);
      }
    }

    return returnVals;
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
