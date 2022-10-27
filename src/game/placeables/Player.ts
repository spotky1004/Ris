import PlaceableBase, { PlaceableBaseOptions } from "./PlaceableBase.js";
import type Item from "../core/Item.js";
import WorkingItem from "../core/WorkingItem.js";

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
  readonly memberId: string;
  readonly memberName: string;
  items: WorkingItem[];

  constructor(options: PlayerOptions) {
    super(options);

    this.type = "Player";
    this.memberId = options.memberId;
    this.memberName = options.memberName;
    this.items = [];

    this.zIndex = 5;
  }

  render() {
    this._render({
      bgColor: "#e6eabc",
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
    const field = this.game.board.canvas.getFieldLayer(0);
    const [dx, dy] = this.looking;
    field.fillText({
      text: (arrows[dy + 1] ?? [])[dx + 1] ?? "",
      x: this.x + dx, y: this.y + dy,
      font: {
        fontFamilys: ["arial"],
      },
      color: "#000",
      maxSize: 0.5,
      baseline: "middle", textAlign: "center"
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
    return true;
  }

  look(x: number, y: number) {
    this.looking = [Math.sign(x) as -1 | 0 | 1, Math.sign(y) as -1 | 0 | 1];
    const tile = this.game.board.getTile(this.x + this.looking[0], this.y + this.looking[1]);
    const playerToHit = tile.find(v => v.type === "player");
    if (typeof playerToHit === "undefined") return;
    playerToHit.attackedBy(this);
  }

  addItem(item: Item) {
    this.items.push(new WorkingItem(this.game, this, item));
  }

  get displayName(): string {
    return `<@${this.memberId}>`;
  }
}
