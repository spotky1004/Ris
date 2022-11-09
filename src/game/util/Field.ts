import CanvasModule from "canvas";
import fs from "fs";
import path from "path";
import getPath from "../../util/getPath.js";

const { __dirname } = getPath(import.meta.url);
const fontDirPath = path.join(__dirname, "../../../resource/font");
for (const file of fs.readdirSync(fontDirPath)) {
  const filePath = path.join(fontDirPath, file);
  const familyName = (file.match(/^(.+)\.[^.]+$/) ?? [])[1];
  if (!familyName) continue;
  CanvasModule.registerFont(filePath, { family: familyName });
}

type Canvas = CanvasModule.Canvas;

interface FieldOptions {
  size: {
    width: number;
    height: number;
  };
  camera: Camera;
}
interface Camera {
  x: number;
  y: number;
  zoom: number;
}

interface FillTextOptions {
  text: string;
  x: number;
  y: number;
  color: string;
  font: {
    bold?: boolean;
    fontFamilys: string[]
  }
  maxSize?: number;
  maxWidth?: number;
  textAlign?: CanvasRenderingContext2D["textAlign"];
  baseline?: CanvasRenderingContext2D["textBaseline"];
  ignoreCamera?: boolean;
}

export interface BaseAttrs {
  x: number;
  y: number;
}
export interface ObjectAttrs extends BaseAttrs {
}
export interface ObjectAttrsWithSize extends BaseAttrs {
  size: number;
}
export interface GlobalAttrs extends BaseAttrs {
  width: number;
  height: number;
  zoom: number;
}

export default class Field {
  canvas: Canvas;
  private readonly ctx: CanvasRenderingContext2D;
  private canvasAttr: GlobalAttrs;
  width: number;
  height: number;
  private readonly camera: Camera;

  constructor(options: FieldOptions) {
    const { width, height } = options.size;
    this.canvas = CanvasModule.createCanvas(width, height);
    this.ctx = this.canvas.getContext("2d");
    this.width = options.size.width;
    this.height = options.size.height;

    this.camera = {
      x: options.camera.x,
      y: options.camera.y,
      zoom: options.camera.zoom
    };

    this.canvasAttr = this.getCanvasAttr();
  }

  private getCanvasAttr(): GlobalAttrs {
    return {
      width: this.width,
      height: this.height,
      x: this.camera.x,
      y: this.camera.y,
      zoom: this.camera.zoom
    };
  }

  private updateCanvasAttr() {
    this.canvasAttr = this.getCanvasAttr();
  }

  localToGlobalAttr<T extends ObjectAttrs | ObjectAttrsWithSize>(localAttr: T): T {
    const { x: localX, y: localY, size } = localAttr as ObjectAttrsWithSize;
    const { x: cameraX, y: cameraY, zoom, width, height } = this.canvasAttr;
  
    const globalAttr: ObjectAttrsWithSize = {
      x: (localX-cameraX)*zoom*Math.min(width, height),
      y: (localY-cameraY)*zoom*Math.min(width, height),
      size: size*zoom*Math.min(width, height)
    };
    if (width > height) {
      globalAttr.x += (width-height)/2;
    } else {
      globalAttr.y += (height-width)/2;
    }
    return globalAttr as any;
  }

  globalToLocalAttr(globalAttr: BaseAttrs): BaseAttrs {
    const { width, height } = this;
    const { x, y } = globalAttr;
    const { x: cameraX, y: cameraY, zoom } = this.camera;
    const offset: BaseAttrs = {
      x: 0,
      y: 0
    };
    if (width > height) {
      offset.x -= (width-height)/2;
    } else {
      offset.y -= (height-width)/2;
    }
    const pos: BaseAttrs = {
      x: (x+offset.x)/Math.min(width, height)/zoom+cameraX,
      y: (y+offset.y)/Math.min(width, height)/zoom+cameraY
    };
    return pos;
  }

  set x(value: number) {
    this.camera.x = value;
    this.updateCanvasAttr();
  }

  set y(value: number) {
    this.camera.y = value;
    this.updateCanvasAttr();
  }

  set zoom(value: number) {
    this.camera.zoom = value;
    this.updateCanvasAttr();
  }

  get x() {
    return this.camera.x;
  }

  get y() {
    return this.camera.y;
  }

  get zoom() {
    return this.camera.zoom;
  }

  set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
    this.ctx.strokeStyle = value;
  }

  get strokeStyle() {
    return this.ctx.strokeStyle;
  }

  set fillStyle(value: string | CanvasGradient | CanvasPattern) {
    this.ctx.fillStyle = value;
  }

  get fillStyle() {
    return this.ctx.fillStyle;
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    const { x: _x1, y: _y1 } = this.localToGlobalAttr({ x: x1, y: y1 });
    const { x: _x2, y: _y2 } = this.localToGlobalAttr({ x: x2, y: y2 });
    const ctx = this.ctx;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(_x1, _y1);
    ctx.lineTo(_x2, _y2);
    ctx.stroke();
    ctx.restore();
  }

  strokeRect(x: number, y: number, w: number, h: number) {
    const { x: _x, y: _y, size: _w } = this.localToGlobalAttr({ x, y, size: w });
    const { size: _h } = this.localToGlobalAttr({ x: 0, y: 0, size: h });
    
    this.ctx.beginPath();
    this.ctx.rect(_x, _y, _w, _h);
    this.ctx.stroke();
  }

  fillRect(x: number, y: number, w: number, h: number) {
    const { x: _x, y: _y, size: _w } = this.localToGlobalAttr({ x, y, size: w });
    const { size: _h } = this.localToGlobalAttr({ x: 0, y: 0, size: h });
    
    this.ctx.fillRect(_x, _y, _w, _h);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  fillCircle(x: number, y: number, radius: number) {
    const { x: _x, y: _y, size: _radius } = this.localToGlobalAttr({ x, y, size: radius });

    this.ctx.beginPath();
    this.ctx.arc(_x, _y, _radius, 0, 2*Math.PI);
    this.ctx.fill();
  }

  fillText(options: FillTextOptions) {
    const ctx = this.ctx;
    const {
      text, font: { bold, fontFamilys }, color, x, y,
      maxSize=Infinity, maxWidth=Infinity, baseline="alphabetic", textAlign="left"
    } = options;

    ctx.save();

    const localAttr1 = { x, y, size: maxWidth };
    const localAttr2 = { x, y, size: maxSize };
    const globalAttr = this.localToGlobalAttr(localAttr1);
    ctx.font = `100px ${fontFamilys.map(v => `"${v}"`).join(", ")}`;
    const textMetrics = ctx.measureText(text);
    const scale = globalAttr.size/textMetrics.width;
    const fontSize = Math.min(100*scale, this.localToGlobalAttr(localAttr2).size);

    ctx.fillStyle = color;
    ctx.textBaseline = baseline;
    ctx.textAlign = textAlign;
    ctx.font = (bold ? "bold " : "") + `${fontSize}px ${fontFamilys.map(v => `"${v}"`).join(", ")}`;
    ctx.fillText(text, globalAttr.x, globalAttr.y, globalAttr.size);

    ctx.restore();
  }

  getImageData() {
    return this.ctx.getImageData(0, 0, this.width, this.height);
  }
}
