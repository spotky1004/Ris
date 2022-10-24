import PlaceableBase from "./PlaceableBase.js";
export default class Player extends PlaceableBase {
    constructor(options) {
        super(options);
        this.type = "player";
        this.memberId = options.memberId;
        this.memberName = options.memberName;
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
                    text: this.status.hp.toString(),
                    color: "#f00"
                }
            ]
        });
    }
    get displayName() {
        return `<@${this.memberId}>`;
    }
}
