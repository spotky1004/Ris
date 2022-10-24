import PlaceableBase, { PlaceableBaseOptions } from "./PlaceableBase.js";

export interface PlayerOptions extends PlaceableBaseOptions {
  memberId: string;
  memberName: string;
}

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
  }

  get displayName(): string {
    return `<@${this.memberId}>`;
  }
}
