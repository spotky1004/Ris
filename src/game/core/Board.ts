import BoardCanvas from "./BoardCanvas.js";
import type PlaceableBase from "../placeables/PlaceableBase.js";
import type Game from "./Game.js";

export interface BoardOptions {
  size: [x: number, y: number];
  
}

export default class Board {
  // @ts-ignore
  private game: Game;
  readonly width: number;
  readonly height: number;
  canvas: BoardCanvas;
  private grid: PlaceableBase[][][];

  constructor(game: Game, options: BoardOptions) {
    this.game = game;
    [this.width, this.height] = options.size;
    this.canvas = new BoardCanvas(game, this);
    this.grid = Array.from({ length: this.height }, _ => Array.from({ length: this.width }, _ => []));
  }

  getTile(x: number, y: number) {
    return (this.grid[y] ?? [])[x] ?? [];
  }

  getAllPlaceables(type?: RegExp | string) {
    const all = this.grid.flat(2);
    if (typeof type !== "undefined") {
      if (typeof type === "string") {
        return all.filter(v => v.type === type);
      } else {
        return all.filter(v => type.test(v.type));
      }
    }
    return all;
  }

  spawnPlaceable(x: number, y: number, item: PlaceableBase) {
    const tile = this.getTile(x, y);
    if (tile.includes(item)) return false;
    tile.push(item);
    return true;
  }

  removePlaceable(x: number, y: number, item: PlaceableBase) {
    const tile = this.getTile(x, y);
    if (!tile.includes(item)) return false;
    const idx = tile.findIndex(v => v === item);
    tile.splice(idx, 1);
    return true;
  }
}
