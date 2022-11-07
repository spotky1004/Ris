import StatusManager, { StatusManagerOptions, AttackType } from "./StatusManager.js";
import WorkingItem from "./WorkingItem.js";
import type {
  default as Item,
  ItemActivateEventNames,
  ItemActivateEventData,
  ItemActivateEventReturn
} from "./Item.js";
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

    this.spawn();
  }

  spawn() {
    return this.game.board.spawnPlaceable(this._x, this._y, this);
  }

  despawn() {
    return this.game.board.removePlaceable(this._x, this._y, this);
  }

  private respawn(x: number, y: number) {
    this.despawn();
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

  render() {

  }

  addItem(item: Item) {
    this.items.push(new WorkingItem(this.game, this, item));
  }

  removeItem(item: WorkingItem) {
    const idx = this.items.findIndex(i => i === item);
    if (idx === -1) return null;
    return this.items.splice(idx, 1)[0];
  }

  getItems<T extends undefined | ItemActivateEventNames>(type?: T) {
    type Type = T extends undefined ? ItemActivateEventNames : T;
    const items: WorkingItem<Type>[] = [];
    for (const item of this.items) {
      if (typeof type === "undefined" || item.on === type || item.on === "always") {
        items.push(item);
      }
    }
    return items;
  }

  async emitItems<T extends ItemActivateEventNames>(type: T, data: ItemActivateEventData[T]): Promise<ItemActivateEventReturn[T][]> {
    const itemsToEmit = this.getItems(type);
    const returnVals: ItemActivateEventReturn[T][] = [];
    for (const item of itemsToEmit) {
      const returnVal = await item.emit(type, data);
      if (returnVal) returnVals.push(returnVal);
      if (
        item.data.destroyOnEmit &&
        (!returnVal || returnVal.ignoreDestroyOnEmit)
      ) {
        this.removeItem(item);
      }
    }
    return returnVals;
  }

  async useItem(idx: number) {
    const useableItems = this.getItems("used");
    const item = useableItems[idx];
    if (!item) return null;
    const result = await item.emit("used", {});
    if (!result) {
      this.removeItem(item);
    }
    return item;
  }

  attackedBy(by: PlaceableBase, atk?: number, type?: AttackType) {
    atk = atk ?? by.status.getAtk();
    const dmgGot = this.status.attack(atk, type ?? "normal");
    this.game.messageSender.attack(by, this, dmgGot);
  }

  death() {
    this.despawn();
    this.game.messageSender.death(this);
  }

  get displayName() {
    return this.name;
  }
}
