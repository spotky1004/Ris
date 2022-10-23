import BoardCanvas from "./BoardCanvas.js";
export default class Board {
    constructor(game, options) {
        this.game = game;
        [this.width, this.height] = options.size;
        this.canvas = new BoardCanvas(game, this);
        this.grid = Array.from({ length: this.height }, _ => Array.from({ length: this.width }, _ => []));
    }
    spawnPlaceable(x, y, item) {
        const tile = this.grid[y][x];
        if (tile.includes(item))
            return false;
        this.grid[y][x].push(item);
        return true;
    }
}
