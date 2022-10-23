import BoardCanvas from "./BoardCanvas.js";
import type PlaceableBase from "../placeables/PlaceableBase.js";
import type Game from "./Game.js";

export interface BoardOptions {
  size: [x: number, y: number];
  
}

export default class Board {
  // @ts-ignore
  private game: Game;
  width: number;
  height: number;
  canvas: BoardCanvas;
  grid: PlaceableBase[][][];

  constructor(game: Game, options: BoardOptions) {
    this.game = game;
    [this.width, this.height] = options.size;
    this.canvas = new BoardCanvas(game, this);
    this.grid = Array.from({ length: this.height }, _ => Array.from({ length: this.width }, _ => []));
  }

  spawnPlaceable(x: number, y: number, item: PlaceableBase) {
    const tile = this.grid[y][x];
    if (tile.includes(item)) return false;
    this.grid[y][x].push(item);
    return true;
  }
}
