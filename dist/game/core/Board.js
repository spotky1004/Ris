import BoardCanvas from "./BoardCanvas.js";
export default class Board {
    constructor(game, options) {
        this.game = game;
        [this.width, this.height] = options.size;
        this.canvas = new BoardCanvas(game, this);
        this.grid = Array.from({ length: this.height }, _ => Array.from({ length: this.width }, _ => []));
    }
    getTile(x, y) {
        var _a, _b;
        return (_b = ((_a = this.grid[y]) !== null && _a !== void 0 ? _a : [])[x]) !== null && _b !== void 0 ? _b : [];
    }
    getAllPlaceables(type) {
        const all = this.grid.flat(2);
        if (typeof type !== "undefined") {
            if (typeof type === "string") {
                return all.filter(v => v.type === type);
            }
            else {
                return all.filter(v => type.test(v.type));
            }
        }
        return all;
    }
    spawnPlaceable(x, y, item) {
        const tile = this.getTile(x, y);
        if (tile.includes(item))
            return false;
        tile.push(item);
        return true;
    }
    removePlaceable(x, y, item) {
        const tile = this.getTile(x, y);
        if (!tile.includes(item))
            return false;
        const idx = tile.findIndex(v => v === item);
        tile.splice(idx, 1);
        return true;
    }
}
