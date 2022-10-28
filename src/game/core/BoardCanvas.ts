import Field from "../util/Field.js";
import Canvas from "canvas";
import type Game from "./Game.js";
import type Board from "./Board.js";

export default class BoardCanvas {
  // @ts-ignore
  private game: Game;
  private size: { width: number, height: number };
  private fieldLayers: Field[];

  constructor(game: Game, board: Board) {
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

  getFieldLayer(layer: 0 | 1 | 2) {
    return this.fieldLayers[layer];
  }

  clearCanvas() {
    for (const z of [0, 1, 2]) {
      this.fieldLayers[z].clear();
    }
  }

  render() {
    this.clearCanvas();

    const board = this.game.board;
    const { width, height } = board;

    this.fieldLayers[0].fillStyle = "#fff";
    this.fieldLayers[0].fillRect(0, 0, width, height);
    this.fieldLayers[0].fillStyle = "#f2f2f2";

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if ((x+y)%2 === 0) {
          this.fieldLayers[0].fillRect(x, y, 1, 1);
        }
      }
    }
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = [...board.getTile(x, y)].sort((a, b) => a.zIndex - b.zIndex);
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
