import PlaceableBase, { PlaceableBaseOptions } from "./PlaceableBase.js";

export interface PlayerOptions extends PlaceableBaseOptions {
  memberId: string;
  memberName: string;
  maxHp: number;
  hp?: number;
}

export default class Player extends PlaceableBase {
  readonly memberId: string;
  readonly memberName: string;
  maxHp: number;
  hp: number;

  constructor(options: PlayerOptions) {
    super(options);

    this.memberId = options.memberId;
    this.memberName = options.memberName;
    this.maxHp = options.maxHp;
    this.hp = options.hp ?? options.maxHp;

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
          text: this.hp.toString(),
          color: "#f00"
        }
      ]
    });
  }

  isPlayer(): true {
    return true;
  }
}
