import CanvasModule from "canvas";
export default class Field {
    constructor(options) {
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
    getCanvasAttr() {
        return {
            width: this.width,
            height: this.height,
            x: this.camera.x,
            y: this.camera.y,
            zoom: this.camera.zoom
        };
    }
    updateCanvasAttr() {
        this.canvasAttr = this.getCanvasAttr();
    }
    localToGlobalAttr(localAttr) {
        const { x: localX, y: localY, size } = localAttr;
        const { x: cameraX, y: cameraY, zoom, width, height } = this.canvasAttr;
        const globalAttr = {
            x: (localX - cameraX) * zoom * Math.min(width, height),
            y: (localY - cameraY) * zoom * Math.min(width, height),
            size: size * zoom * Math.min(width, height)
        };
        if (width > height) {
            globalAttr.x += (width - height) / 2;
        }
        else {
            globalAttr.y += (height - width) / 2;
        }
        return globalAttr;
    }
    globalToLocalAttr(globalAttr) {
        const { width, height } = this;
        const { x, y } = globalAttr;
        const { x: cameraX, y: cameraY, zoom } = this.camera;
        const offset = {
            x: 0,
            y: 0
        };
        if (width > height) {
            offset.x -= (width - height) / 2;
        }
        else {
            offset.y -= (height - width) / 2;
        }
        const pos = {
            x: (x + offset.x) / Math.min(width, height) / zoom + cameraX,
            y: (y + offset.y) / Math.min(width, height) / zoom + cameraY
        };
        return pos;
    }
    set x(value) {
        this.camera.x = value;
        this.updateCanvasAttr();
    }
    set y(value) {
        this.camera.y = value;
        this.updateCanvasAttr();
    }
    set zoom(value) {
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
    set strokeStyle(value) {
        this.ctx.strokeStyle = value;
    }
    get strokeStyle() {
        return this.ctx.strokeStyle;
    }
    set fillStyle(value) {
        this.ctx.fillStyle = value;
    }
    get fillStyle() {
        return this.ctx.fillStyle;
    }
    drawLine(x1, y1, x2, y2) {
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
    strokeRect(x, y, w, h) {
        const { x: _x, y: _y, size: _w } = this.localToGlobalAttr({ x, y, size: w });
        const { size: _h } = this.localToGlobalAttr({ x: 0, y: 0, size: h });
        this.ctx.beginPath();
        this.ctx.rect(_x, _y, _w, _h);
        this.ctx.stroke();
    }
    fillRect(x, y, w, h) {
        const { x: _x, y: _y, size: _w } = this.localToGlobalAttr({ x, y, size: w });
        const { size: _h } = this.localToGlobalAttr({ x: 0, y: 0, size: h });
        this.ctx.fillRect(_x, _y, _w, _h);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    fillCircle(x, y, radius) {
        const { x: _x, y: _y, size: _radius } = this.localToGlobalAttr({ x, y, size: radius });
        this.ctx.beginPath();
        this.ctx.arc(_x, _y, _radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    fillText(options) {
        const ctx = this.ctx;
        const { text, font: { bold, fontFamilys }, color, x, y, maxSize = Infinity, maxWidth = Infinity, baseline = "alphabetic", textAlign = "left" } = options;
        ctx.save();
        const localAttr1 = { x, y, size: maxWidth };
        const localAttr2 = { x, y, size: maxSize };
        const globalAttr = this.localToGlobalAttr(localAttr1);
        ctx.font = `100px ${fontFamilys.map(v => `"${v}"`).join(", ")}`;
        const textMetrics = ctx.measureText(text);
        const scale = globalAttr.size / textMetrics.width;
        const fontSize = Math.min(100 * scale, this.localToGlobalAttr(localAttr2).size);
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
