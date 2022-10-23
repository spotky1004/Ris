import Field from "../util/Field.js";
import Canvas from "canvas";
export default class BoardCanvas {
    constructor(game, board) {
        this.game = game;
        this.size = {
            width: board.width * 200,
            height: board.height * 200
        };
        this.fieldLayers = [];
        for (const z of [0, 1, 2]) {
            const field = new Field({
                size: this.size,
                camera: {
                    x: 0, y: 0,
                    zoom: 1 / Math.min(board.width, board.height)
                }
            });
            this.fieldLayers[z] = field;
        }
    }
    getFieldLayer(layer) {
        return this.fieldLayers[layer];
    }
    render() {
        const grid = this.game.board.grid;
        const { width, height } = this.game.board;
        for (const z of [0, 1, 2]) {
            this.fieldLayers[z].clear();
        }
        this.fieldLayers[0].fillStyle = "#fff";
        this.fieldLayers[0].fillRect(0, 0, width, height);
        this.fieldLayers[0].fillStyle = "#f2f2f2";
        for (let y = 0; y < height; y++) {
            const row = grid[y];
            for (let x = 0; x < width; x++) {
                if ((x + y) % 2 === 0) {
                    this.fieldLayers[0].fillRect(x, y, 1, 1);
                }
                const tile = [...row[x]].sort((a, b) => a.zIndex - b.zIndex);
                for (const placeable of tile) {
                    void placeable.render();
                }
            }
        }
    }
    toBuffer() {
        const { width, height } = this.size;
        const mainCanvas = Canvas.createCanvas(width, height);
        const ctx = mainCanvas.getContext("2d");
        for (const z of [0, 1, 2]) {
            ctx.drawImage(this.fieldLayers[z].canvas, 0, 0);
        }
        return mainCanvas.toBuffer();
    }
}
