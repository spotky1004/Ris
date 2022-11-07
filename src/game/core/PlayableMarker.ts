import PlaceableBase, { PlaceableBaseOptions } from "./PlaceableBase.js";
import type Player from "./Player.js";

export interface PlayerMoveReturn {
  moveSuccess: boolean;
  attack: boolean
}
export interface PlayableMarkerOptions extends PlaceableBaseOptions {
  playerData: Player;
}

export default class PlayableMarker extends PlaceableBase {
  playerData: Player;

  constructor(options: PlayableMarkerOptions) {
    super(options);

    this.playerData = options.playerData;
  }

  move(x: number, y: number): PlayerMoveReturn {
    this.x += x;
    this.y += y;
    this.playerData.actionDid.move = true;
    return {
      moveSuccess: true,
      attack: false
    };
  }

  look(x: number, y: number) {
    this.looking = [Math.sign(x) as -1 | 0 | 1, Math.sign(y) as -1 | 0 | 1];
  }

  death() {
    this.despawn();
    this.game.messageSender.death(this);
    this.playerData.defeated = true;
  }
}
