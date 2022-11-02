import StatusManager, { StatusManagerOptions, AttackType } from "./StatusManager.js";
import WorkingItem from "./WorkingItem.js";
import type { default as Item, ItemActivateEventNames } from "./Item.js";
import type Game from "./Game.js";

export interface PlaceableBaseOptions {
  game: Game;
  name?: string;
  x: number;
  y: number;
  status?: StatusManagerOptions;
  owner?: PlaceableBase;
  looking?: [x: -1 | 0 | 1, y: -1 | 0 | 1];
  shape?: [x: number, y: number][];
}

export interface RenderStringOptions {
  text: string;
  color: string;
}
export interface RenderOptions {
  bgColor: string;
  name: RenderStringOptions;
  numbers: RenderStringOptions[];
}

export default class PlaceableBase {
  type: string;
  game: Game;
  name: string;
  private _x: number;
  private _y: number;
  status: StatusManager;
  zIndex: number;
  owner: PlaceableBase | undefined;
  looking: [x: -1 | 0 | 1, y: -1 | 0 | 1];
  shape: [x: number, y: number][];
  tags: string[];
  items: WorkingItem[];

  constructor(options: PlaceableBaseOptions) {
    this.type = "Unknown";
    this.game = options.game;
    this.name = options.name ?? "Unknown";
    this._x = options.x;
    this._y = options.y;
    this.status = new StatusManager(this.game, this, options.status);
    this.zIndex = -1;
    this.owner = options.owner ?? undefined;
    this.looking = options.looking ? [options.looking[0], options.looking[1]] : [0, 1];
    this.shape = options.shape ?? [];
    this.tags = [];
    this.items = [];

    this.game.board.spawnPlaceable(this._x, this._y, this);
  }

  spawn() {
    return this.game.board.spawnPlaceable(this._x, this._y, this);
  }

  remove() {
    return this.game.board.removePlaceable(this._x, this._y, this);
  }

  private respawn(x: number, y: number) {
    this.remove();
    this._x = x;
    this._y = y;
    this.spawn();
  }

  set x(value: number) {
    this.respawn(value, this._y);
    this._x = value;
  }
  
  set y(value: number) {
    this.respawn(this._x, value);
    this._y = value;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  _render(options: RenderOptions, layer?: 0 | 1 | 2) {
    const field = this.game.board.canvas.getFieldLayer(layer ?? 1);
    const w = 1;
    const h = 1;
    const x = this._x * w;
    const y = this._y * h;
    
    field.fillStyle = options.bgColor;
    field.fillRect(x, y, w, h);
    for (const [sx, sy] of this.shape) {
      field.fillRect(x + sx, y + sy, w, h);
    }
    
    field.fillText({
      text: options.name.text,
      color: options.name.color,
      x: x + w/2, y: (options.numbers.length === 0 ? y + h/2 : y + h*0.35),
      maxSize: Math.min(w, h) / 4,
      maxWidth: w * 0.8,
      font: {
        fontFamilys: ["arial"],
        bold: true
      },
      baseline: "middle", textAlign: "center"
    });
    for (let i = 0; i < options.numbers.length; i++) {
      field.fillText({
        text: options.numbers[i].text,
        color: options.numbers[i].color,
        x: x + (i + 1)*w/(options.numbers.length + 1), y: y + h*0.65,
        maxSize: Math.min(w, h) / 4,
        maxWidth: w * 0.95/options.numbers.length,
        font: {
          fontFamilys: ["arial"],
          bold: true
        },
        baseline: "middle", textAlign: "center"
      });
    }
  }

  render() {

  }

  addItem(item: Item) {
    this.items.push(new WorkingItem(this.game, this, item));
  }

  getItems<T extends undefined | ItemActivateEventNames>(type?: T) {
    type Type = T extends undefined ? ItemActivateEventNames : T;
    const items: WorkingItem<Type>[] = [];
    for (const item of this.items) {
      if (typeof type === "undefined" || item.on === type) {
        items.push(item);
      }
    }
    return items;
  }

  attackedBy(by: PlaceableBase, atk?: number, type?: AttackType) {
    atk = atk ?? by.status.getAtk();
    const dmgGot = this.status.attack(atk, type ?? "normal");
    this.game.messageSender.attack(by, this, dmgGot);
  }

  get displayName() {
    return this.name;
  }
}
