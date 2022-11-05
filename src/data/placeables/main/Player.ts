import { PlaceableBase, PlaceableBaseOptions } from "../essentials.js";

export interface PlayerOptions extends PlaceableBaseOptions {
  memberId: string;
  memberName: string;
}

const arrows = [
  ["↖", "↑", "↗"],
  ["←", " ", "→"],
  ["↙", "↓", "↘"]
];

export default class Player extends PlaceableBase {
  type: "Player";
  money: number;
  actionCountLeft: number;
  actionDid: [combine: boolean, move: boolean];
  readonly memberId: string;
  readonly memberName: string;

  constructor(options: PlayerOptions) {
    super(options);

    this.type = "Player";
    this.money = this.game.config.startMoney;
    this.actionCountLeft = this.game.config.actionCount;
    this.actionDid = [false, false];
    this.memberId = options.memberId;
    this.memberName = options.memberName;
    this.items = [];
    this.tags.push("solid");

    this.zIndex = 5;
  }

  render() {
    const canvas = this.game.board.canvas;

    // Draww block
    canvas.addRenderItem("basicPlaceable", 5, {
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
    canvas.addRenderItem("text", -1, {
      layer: 0,
      text: (arrows[dy + 1] ?? [])[dx + 1] ?? "",
      x: this.x + dx + 0.5, y: this.y + dy + 0.5,
      maxWidth: 1/8,
    });
  }

  move(x: number, y: number) {
    const { width, height } = this.game.board;
    let [tx, ty] = [this.x + x, this.y + y];
    if (
      0 > tx || tx >= width ||
      0 > ty || ty >= height
    ) return false;
    this.look(x, y);
    if (this.game.board.isTagInTile(tx, ty, "soldi")) {
      return true;
    }
    this.x += x;
    this.y += y;
    return true;
  }

  look(x: number, y: number) {
    this.looking = [Math.sign(x) as -1 | 0 | 1, Math.sign(y) as -1 | 0 | 1];
    const tile = this.game.board.getTile(this.x + this.looking[0], this.y + this.looking[1]);
    const playerToHit = tile.find(v => v.type === "Player");
    if (typeof playerToHit === "undefined") return;
    playerToHit.attackedBy(this);
  }

  get displayName(): string {
    return `<@${this.memberId}>`;
  }
}
