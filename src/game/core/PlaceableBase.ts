import StatusManager, { StatusManagerOptions, Damage } from "./StatusManager.js";
import WorkingItem from "./WorkingItem.js";
import TagsManager from "../util/TagsManager.js";
import type Item from "./Item.js";
import type Game from "./Game.js";
import type {
  GameEventNames,
  GameEventData,
  ItemGameEventReturn,
  StatusEffectGameEventReturn
} from "@typings/GameEvent";

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
  tags: TagsManager;
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
    this.tags = new TagsManager();
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

  getShape() {
    const { x, y } = this;
    const shape = [...this.shape].map(([sx, sy]) => [sx + x, sy + y]);
    shape.push([this._x, this._y]);
    return shape;
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

  getItems<T extends undefined | GameEventNames>(type?: T, timing?: "before" | "after") {
    type Type = T extends undefined ? GameEventNames : T;
    const items: WorkingItem<Type>[] = [];
    for (const item of this.items) {
      if (
        (item.on === type && item.data.timing === timing) ||
        typeof type === "undefined" ||
        item.on === "always"
      ) {
        items.push(item);
      }
    }
    return items;
  }

  async emitItems<T extends GameEventNames>(type: T, timing: "before" | "after", data: GameEventData[T]): Promise<ItemGameEventReturn[T][]> {
    const itemsToEmit = this.getItems(type, timing);
    const returnVals: ItemGameEventReturn[T][] = [];
    for (const item of itemsToEmit) {
      const returnVal = await item.emit(type, timing, data);
      if (returnVal) returnVals.push(returnVal);
      if (
        item.data.destroyOnEmit &&
        (!returnVal || returnVal.ignoreDestroyOnEmit)
      ) {
        this.removeItem(item);
      }
    }
    return returnVals.sort((a, b) => (a.perioty ?? 1) - (b.perioty ?? 1));
  }

  async emitEvent<T extends GameEventNames>(type: T, timing: "before" | "after", data: GameEventData[T]): Promise<[ItemGameEventReturn[T][], StatusEffectGameEventReturn[T][]]> {
    const itemReturnVals = await this.emitItems(type, timing, data);
    const statusEffectReturnVals = await this.status.emitStatusEffects(type, timing, data);

    return [itemReturnVals, statusEffectReturnVals];
  }

  async attackedBy(by: string | PlaceableBase, damage?: Damage) {
    if (typeof by === "string") {
      damage = damage ?? ({
        normal: 0
      });
      const dmgGot = this.status.attack(damage);
      await this.game.messageSender.attack(by, this, dmgGot);
    } else {
      damage = damage ?? by.status.getDamage();
      const dmgGot = this.status.attack(damage);
      await this.game.messageSender.attack(by, this, dmgGot);
    }
  }

  death() {
    this.despawn();
    this.game.messageSender.death(this);
  }

  get displayName() {
    return this.name;
  }
}
