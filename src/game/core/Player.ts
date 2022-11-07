import PlayableMarker from "./PlayableMarker.js";
import Game from "./Game.js";

export interface PlayerOptions {
  id: string;
  displayName: string;
  money?: number;
  actionCountLeft?: number;
}
interface ActionDid {
  combine: boolean;
  move: boolean;
}

export default class Player {
  readonly id: string;
  readonly displayName: string;
  money: number;
  actionCountLeft: number;
  actionDid: ActionDid;
  defeated: boolean;
  private _marker: PlayableMarker | undefined;

  constructor(options: PlayerOptions) {
    this.id = options.id;
    this.displayName = options.displayName;
    this.money = options.money ?? -1;
    this.actionCountLeft = options.actionCountLeft ?? -1;
    this.actionDid = {
      combine: false,
      move: false
    };
    this.defeated = false;
  }

  get marker(): PlayableMarker {
    const marker = this._marker;
    if (!marker) throw new Error("Player marker isn't initilized.\nUse Player.connectGame(game) to create temporary marker.");
    return marker;
  }

  get pingString() {
    return `<@${this.id}>`;
  }

  connectGame(game: Game) {
    const {
      actionCount: cfgActionCount,
      startMoney: cfgStartMoney
    } = game.config;
    if (this.money === -1) this.money = cfgStartMoney;
    if (this.actionCountLeft === -1) this.actionCountLeft = cfgActionCount;
    this._marker = new PlayableMarker({
      game, playerData: this,
      x: -1, y: -1
    });
  }

  connectMarker(marker: PlayableMarker) {
    this._marker = marker;
  }
}
