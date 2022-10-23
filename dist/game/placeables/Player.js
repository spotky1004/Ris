import PlaceableBase from "./PlaceableBase.js";
export default class Player extends PlaceableBase {
    constructor(options) {
        var _a;
        super(options);
        this.memberId = options.memberId;
        this.memberName = options.memberName;
        this.maxHp = options.maxHp;
        this.hp = (_a = options.hp) !== null && _a !== void 0 ? _a : options.maxHp;
        this.zIndex = 5;
    }
    render() {
        this._render({
            bgColor: "#e6eabc",
            name: {
                text: this.memberName,
                color: "#000"
            },
            numbers: [
                {
                    text: this.hp.toString(),
                    color: "#f00"
                }
            ]
        });
    }
    isPlayer() {
        return true;
    }
}
