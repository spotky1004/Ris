import { PlayableMarker, PlayableMarkerOptions } from "../essentials.js";
import tags from "../../tags.js";

export interface PlayerOptions extends PlayableMarkerOptions {
  memberId: string;
  memberName: string;
}

const arrows = [
  ["↖", "↑", "↗"],
  ["←", " ", "→"],
  ["↙", "↓", "↘"]
];

export default class PlayerMarker extends PlayableMarker {
  type: "PlayerMarker";
  readonly memberId: string;
  readonly memberName: string;

  constructor(options: PlayerOptions) {
    super(options);

    this.type = "PlayerMarker";
    this.memberId = options.memberId;
    this.memberName = options.memberName;
    this.items = [];
    this.tags.add(tags.Solid);

    this.zIndex = 5;
  }

  render() {
    const canvas = this.game.board.canvas;

    // Draww placeable
    canvas.addPlaceableRenderItem("basicPlaceable", 5, {
      bgColor: "#e6eabc",
      x: this.x, y: this.y,
      shape: this.shape,
      name: {
        text: this.memberName,
        color: "#000"
      },
      numbers: [
        {
          text: this.status.hp.toString(),
          color: "#f00"
        }
      ]
    });

    // Draw arrow
    const [dx, dy] = this.looking;
    canvas.addPlaceableRenderItem("text", -1, {
      layer: 0,
      text: (arrows[dy + 1] ?? [])[dx + 1] ?? "",
      bold: true,
      x: this.x + dx + 0.5, y: this.y + dy + 0.5,
      maxSize: 1/4,
    });
  }

  move(x: number, y: number) {
    const returnValue = {
      moveSuccess: false,
      attack: false
    };

    const { width, height } = this.game.board;
    let [tx, ty] = [this.x + x, this.y + y];
    if (
      0 > tx || tx >= width ||
      0 > ty || ty >= height
    ) return returnValue;
    let attacked = this.look(x, y);
    if (attacked) {
      returnValue.attack = true;
      this.player.actionDid.move = true;
      this.player.actionCountLeft--;
      return returnValue;
    }
    if (this.game.board.isTagInTile(tx, ty, tags.Solid)) {
      return returnValue;
    }
    this.x += x;
    this.y += y;
    this.player.actionDid.move = true;
    this.player.actionCountLeft--;
    attacked = this.look(x, y);
    this.game.emitPlayerTurnTick(this);
    returnValue.moveSuccess = true;
    returnValue.attack = attacked;
    return returnValue;
  }

  look(x: number, y: number) {
    this.looking = [Math.sign(x) as -1 | 0 | 1, Math.sign(y) as -1 | 0 | 1];
    const tile = this.game.board.getTile(this.x + this.looking[0], this.y + this.looking[1]);
    if (!tile) return false;
    const toHit = tile.find(v => v.type === "Player") ?? tile[0];
    if (typeof toHit === "undefined") return false;
    toHit.attackedBy(this);
    return true;
  }

  get displayName(): string {
    return `<@${this.memberId}>`;
  }
}
