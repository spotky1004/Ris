import PlaceableBase from "./PlaceableBase.js";
const arrows = [
    ["↖", "↑", "↗"],
    ["←", " ", "→"],
    ["↙", "↓", "↘"]
];
export default class Player extends PlaceableBase {
    constructor(options) {
        super(options);
        this.type = "Player";
        this.memberId = options.memberId;
        this.memberName = options.memberName;
        this.zIndex = 5;
    }
    render() {
        var _a, _b;
        this._render({
            bgColor: "#e6eabc",
            name: {
                text: this.memberName,
                color: "#000"
            },
            numbers: [
                {
                    text: this.status.hp.toString(),
                    color: "#f00"
                }
            ]
        });
        // Draw arrow
        const field = this.game.board.canvas.getFieldLayer(0);
        const [dx, dy] = this.looking;
        field.fillText({
            text: (_b = ((_a = arrows[dy + 1]) !== null && _a !== void 0 ? _a : [])[dx + 1]) !== null && _b !== void 0 ? _b : "",
            x: this.x + dx, y: this.y + dy,
            font: {
                fontFamilys: ["arial"],
            },
            color: "#000",
            maxSize: 0.5,
            baseline: "middle", textAlign: "center"
        });
    }
    get displayName() {
        return `<@${this.memberId}>`;
    }
}
