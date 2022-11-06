import BoardCanvas from "./BoardCanvas.js";
import type PlaceableBase from "./PlaceableBase.js";
import type Game from "./Game.js";

export interface BoardOptions {
  size: [x: number, y: number];
}

export interface PlaceableSearchQuery {
  toSearch: "tag" | "type";
  /** default: "type" -> "exact", "tag" -> "includes" */
  advanced?: "includes" | "exact";
  value: RegExp | string | string[];
}

export default class Board {
  // @ts-ignore
  private game: Game;
  readonly width: number;
  readonly height: number;
  readonly canvas: BoardCanvas;
  private grid: PlaceableBase[][][];

  constructor(game: Game, options: BoardOptions) {
    this.game = game;
    [this.width, this.height] = options.size;
    this.canvas = new BoardCanvas(game, this);
    this.grid = Array.from({ length: this.height }, _ => Array.from({ length: this.width }, _ => []));
  }

  getTile(x: number, y: number) {
    let tile = (this.grid[y] ?? [])[x];
    if (!tile) return null;
    const allPlaceables = this.getAllPlaceables();
    for (const placeable of allPlaceables) {
      const { x, y } = placeable;
      for (const [sx, sy] of placeable.shape) {
        const tx = x + sx;
        const ty = y + sy;
        if (x === tx && y === ty) {
          tile.push(placeable);
        }
      }
    }
    return tile;
  }

  getAllPlaceables(query?: PlaceableSearchQuery) {
    const all = this.grid.flat(2);
    if (typeof query !== "undefined") {
      const { toSearch, value } = query;
      let advanced = query.advanced;
      advanced ??= toSearch === "type" ? "exact" : "includes";

      // :thinking:
      if (advanced === "exact") {
        if (toSearch === "type") {
          if (typeof value === "string") {
            return all.filter(v => v.type === value);
          } else if (value instanceof RegExp) {
            return all.filter(v => value.test(v.type));
          } else {
            return all.filter(v => value.includes(v.type));
          }
        } else if (toSearch === "tag") {
          if (typeof value === "string") {
            return all.filter(v => v.tags.includes(value));
          } else if (value instanceof RegExp) {
            return all.filter(v => v.tags.every(t => value.test(t)));
          } else {
            return all.filter(v => {
              const lenMatch = v.tags.length === value.length;
              if (!lenMatch) return lenMatch;
              const tagMatch = v.tags.every(t => value.includes(t));
              return tagMatch;
            });
          }
        }
      } else if (advanced === "includes") {
        if (toSearch === "type") {
          if (typeof value === "string") {
            return all.filter(v => v.type.includes(value));
          } else if (value instanceof RegExp) {
            return all.filter(v => value.test(v.type));
          } else {
            return all.filter(v => value.includes(v.type));
          }
        } else if (toSearch === "tag") {
          if (typeof value === "string") {
            return all.filter(v => v.tags.includes(value));
          } else if (value instanceof RegExp) {
            return all.filter(v => v.tags.some(t => value.test(t)));
          } else {
            return all.filter(v => v.tags.some(t => value.includes(t)));
          }
        }
      }
    }
    return all;
  }

  spawnPlaceable(x: number, y: number, item: PlaceableBase) {
    const tile = this.getTile(x, y);
    if (!tile || tile.includes(item)) return false;
    tile.push(item);
    return true;
  }

  removePlaceable(x: number, y: number, item: PlaceableBase) {
    const tile = this.getTile(x, y);
    if (!tile || !tile.includes(item)) return false;
    const idx = tile.findIndex(v => v === item);
    tile.splice(idx, 1);
    return true;
  }

  isOutOfBound(x: number, y: number) {
    return (
      0 > x || x >= this.width ||
      0 > y || y >= this.height
    );
  }

  isTagInTile(x: number, y: number, tag: string) {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    return tile.some(p => p.tags.includes(tag));
  }
}
