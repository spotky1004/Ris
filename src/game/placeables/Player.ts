import PlaceableBase, { PlaceableBaseOptions } from "./PlaceableBase.js";

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
  type: "player";
  readonly memberId: string;
  readonly memberName: string;

  constructor(options: PlayerOptions) {
    super(options);

    this.type = "player";
    this.memberId = options.memberId;
    this.memberName = options.memberName;

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

  get displayName(): string {
    return `<@${this.memberId}>`;
  }
}
