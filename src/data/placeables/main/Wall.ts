import { PlaceableBase, PlaceableBaseOptions, RenderStringOptions } from "../essentials.js";

interface DisplayStatusOptions {
  type: "hp" | "def" | "maxHp";
  color: string;
}

export interface WallOptions extends PlaceableBaseOptions {
  wallName: string;
  wallIndex?: string;
  bgColor: string;
  nameColor: string;
  displayStatus: DisplayStatusOptions[];
}

export default class Wall extends PlaceableBase {
  wallName: string;
  wallIndex: string;
  /** ex) Wall_Magic_A */
  type: `Wall_${string}_${string}`;
  bgColor: string;
  nameColor: string;
  displayStatus: DisplayStatusOptions[];
  
  constructor(options: WallOptions) {
    super(options);

    this.wallName = options.wallName;
    this.wallIndex = options.wallIndex ?? "";
    this.type = `Wall_${options.wallName}_${options.wallIndex}`;
    this.bgColor = options.bgColor;
    this.nameColor = options.nameColor;
    this.displayStatus = options.displayStatus;
  }

  render() {
    const numbers: RenderStringOptions[] = [];
    for (const { type, color } of this.displayStatus) {
      let value: number | string = "Error";
      if (type === "hp") {
        value = this.status.hp;
      } else if (type === "def") {
        value = this.status.getDef();
      } else if (type === "maxHp") {
        value = this.status.maxHp;
      }

      numbers.push({
        text: value.toString(),
        color
      });
    }

    this._render({
      bgColor: this.bgColor,
      name: {
        text: this.wallName,
        color: this.nameColor
      },
      numbers
    });
  }

  get displayName() {
    return this.wallName;
  }
}
