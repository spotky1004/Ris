import type Game from "../core/Game.js";

export interface PlaceableBaseOptions {
  game: Game;
  x: number;
  y: number;
}

interface RenderStringOptions {
  text: string;
  color: string;
}
export interface RenderOptions {
  bgColor: string;
  name: RenderStringOptions;
  numbers: RenderStringOptions[];
}

export default class PlaceableBase {
  private game: Game;
  x: number;
  y: number;
  zIndex: number;

  constructor(options: PlaceableBaseOptions) {
    this.game = options.game;
    this.x = options.x;
    this.y = options.y;
    this.zIndex = -1;
    
    this.game.board.spawnPlaceable(this.x, this.y, this);
  }

  _render(options: RenderOptions, layer?: 0 | 1 | 2) {
    const field = this.game.board.canvas.getFieldLayer(layer ?? 1);
    const w = 1;
    const h = 1;
    const x = this.x * w;
    const y = this.y * h;
    
    field.fillStyle = options.bgColor;
    field.fillRect(x, y, w, h);
    
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
  }

  render() {

  }

  isPlayer(): boolean {
    return false;
  }
}
