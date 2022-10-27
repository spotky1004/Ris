import StatusManager from "../etc/StatusManager.js";
export default class PlaceableBase {
    constructor(options) {
        var _a, _b;
        this.type = "Unknown";
        this.game = options.game;
        this.name = (_a = options.name) !== null && _a !== void 0 ? _a : "Unknown";
        this._x = options.x;
        this._y = options.y;
        this.status = new StatusManager(this.game, this, options.status);
        this.zIndex = -1;
        this.owner = (_b = options.owner) !== null && _b !== void 0 ? _b : undefined;
        this.looking = options.looking ? [options.looking[0], options.looking[1]] : [0, 1];
        this.game.board.spawnPlaceable(this._x, this._y, this);
    }
    spawn() {
        return this.game.board.spawnPlaceable(this._x, this._y, this);
    }
    remove() {
        return this.game.board.removePlaceable(this._x, this._y, this);
    }
    respawn(x, y) {
        this.remove();
        this._x = x;
        this._y = y;
        this.spawn();
    }
    set x(value) {
        this.respawn(value, this._y);
        this._x = value;
    }
    set y(value) {
        this.respawn(this._x, value);
        this._y = value;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    _render(options, layer) {
        const field = this.game.board.canvas.getFieldLayer(layer !== null && layer !== void 0 ? layer : 1);
        const w = 1;
        const h = 1;
        const x = this._x * w;
        const y = this._y * h;
        field.fillStyle = options.bgColor;
        field.fillRect(x, y, w, h);
        field.fillText({
            text: options.name.text,
            color: options.name.color,
            x: x + w / 2, y: (options.numbers.length === 0 ? y + h / 2 : y + h * 0.35),
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
                x: x + (i + 1) * w / (options.numbers.length + 1), y: y + h * 0.65,
                maxSize: Math.min(w, h) / 4,
                maxWidth: w * 0.95 / options.numbers.length,
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
    attackedBy(by, atk, type) {
        atk = atk !== null && atk !== void 0 ? atk : by.status.getAtk();
        const dmgGot = this.status.attack(atk, type !== null && type !== void 0 ? type : "normal");
        this.game.sender.attack(by, this, dmgGot);
    }
    get displayName() {
        return this.name;
    }
}
