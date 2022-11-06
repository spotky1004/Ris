import Field from "../util/Field.js";
import Canvas from "canvas";
import type Game from "./Game.js";
import type Board from "./Board.js";

export interface RenderStringOptions {
  text: string;
  color: string;
}
export interface RenderItems {
  "text": {
    layer?: 0 | 1 | 2;
    text: string;
    color?: string;
    x: number;
    y: number;
    align?: CanvasRenderingContext2D["textAlign"];
    baseline?: CanvasRenderingContext2D["textBaseline"];
    bold?: boolean;
    maxSize?: number;
    maxWidth?: number;
  };
  "basicPlaceable": {
    layer?: 0 | 1 | 2;
    bgColor: string;
    x: number;
    y: number;
    shape?: [x: number, y: number][];
    name: RenderStringOptions;
    numbers: RenderStringOptions[];
  }
}
export type RenderItemsTypes = keyof RenderItems;
type RenderItemsWithType = {
  [K in RenderItemsTypes]: RenderItems[K] & { type: K };
}

export default class BoardCanvas {
  // @ts-ignore
  private game: Game;
  private size: { width: number, height: number };
  private fieldLayers: Field[];
  private placeableRenderItems: [zIndex: number, renderOptions: RenderItemsWithType[RenderItemsTypes]][];
  private renderItems: [zIndex: number, renderOptions: RenderItemsWithType[RenderItemsTypes]][];

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
    this.placeableRenderItems = [];
    this.renderItems = [];
  }

  getFieldLayer(layer: 0 | 1 | 2) {
    return this.fieldLayers[layer];
  }

  clearRenderItems() {
    this.renderItems = [];
  }

  renderPlaceables() {
    this.placeableRenderItems = [];
    const placeables = this.game.board.getAllPlaceables();
    for (const placeable of placeables) {
      placeable.render();
    }
  }

  clearCanvas() {
    for (const z of [0, 1, 2]) {
      this.fieldLayers[z].clear();
    }

    const { width, height } = this.game.board;
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
  }

  addRenderItem<T extends RenderItemsTypes>(type: T, zIndex: number, options: RenderItems[T]) {
    // @ts-ignore
    this.renderItems.push([zIndex, {
      type,
      ...options
    }]);
  }

  addPlaceableRenderItem<T extends RenderItemsTypes>(type: T, zIndex: number, options: RenderItems[T]) {
    // @ts-ignore
    this.placeableRenderItems.push([zIndex, {
      type,
      ...options
    }]);
  }

  render() {
    this.clearCanvas();
    this.renderPlaceables();
    const toRender = [...this.renderItems, ...this.placeableRenderItems];
    toRender.sort((a, b) => a[0] - b[0]);
    
    for (const [, options] of toRender) {
      const type = options.type;
      if (type === "basicPlaceable") {
        const field = this.getFieldLayer(options.layer ?? 1);
        const w = 1;
        const h = 1;
        const x = options.x * w;
        const y = options.y * h;
        
        field.fillStyle = options.bgColor;
        field.fillRect(x, y, w, h);
        if (options.shape) {
          for (const [sx, sy] of options.shape) {
            field.fillRect(x + sx, y + sy, w, h);
          }
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
      } else if (type === "text") {
        const field = this.getFieldLayer(options.layer ?? 0);
        field.fillText({
          text: options.text,
          color: options.color ?? "#000",
          x: options.x, y: options.y,
          font: {
            fontFamilys: ["arial"],
            bold: options.bold ?? false
          },
          textAlign: options.align ?? "center",
          baseline: options.baseline ?? "middle",
          maxSize: options.maxSize ?? 0.5,
          maxWidth: options.maxWidth ?? 1
        });
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
