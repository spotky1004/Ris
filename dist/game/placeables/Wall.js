import PlaceableBase from "./PlaceableBase.js";
export default class Wall extends PlaceableBase {
    constructor(options) {
        var _a;
        super(options);
        this.wallName = options.wallName;
        this.wallIndex = (_a = options.wallIndex) !== null && _a !== void 0 ? _a : "";
        this.type = `Wall_${options.wallName}_${options.wallIndex}`;
        this.bgColor = options.bgColor;
        this.nameColor = options.nameColor;
        this.displayStatus = options.displayStatus;
    }
    render() {
        const numbers = [];
        for (const { type, color } of this.displayStatus) {
            let value = "Error";
            if (type === "hp") {
                value = this.status.hp;
            }
            else if (type === "def") {
                value = this.status.getDef();
            }
            else if (type === "maxHp") {
                value = this.status.maxHp;
            }
            numbers.push({
                text: value.toString(),
                color
            });
        }
        this._render({
            bgColor: this.bgColor,
            name: {
                text: this.wallName,
                color: this.nameColor
            },
            numbers
        });
    }
    get displayName() {
        return this.wallName;
    }
}
