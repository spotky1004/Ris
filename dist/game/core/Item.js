export default class Item {
    constructor(options) {
        var _a, _b, _c, _d;
        this.name = options.name;
        this.unlockedDefault = (_a = options.unlockedDefault) !== null && _a !== void 0 ? _a : true;
        this.madeFrom = options.madeFrom;
        this.on = options.on;
        this.chargeOptions = (_b = options.chargeOptions) !== null && _b !== void 0 ? _b : null;
        this.destroyOnEmit = (_c = options.destroyOnEmit) !== null && _c !== void 0 ? _c : false;
        this.onEmit = options.onEmit;
        let tier = (_d = options.tier) !== null && _d !== void 0 ? _d : 1;
        if (Array.isArray(this.madeFrom)) {
            tier = Math.max(...this.madeFrom.map(item => item.tier)) + 1;
        }
        this.tier = tier;
    }
}
const item = new Item({
    name: "Attack Debugger",
    on: "attacked",
    onEmit: ({ game, owner, data }) => {
        game.sender.send(`${data.from.memberName} attacked ${owner.memberName} for ${data.damage} damage!`);
        const players = game.board.getAllPlaceables("Player");
        console.log(players.includes(owner) ? "The owner is on the board" : "The owner isn't on the board?");
        const walls = game.board.getAllPlaceables(/^wall/g);
        console.log(walls);
    },
    unlockedDefault: false,
    chargeOptions: {
        type: "move",
        length: 3
    },
    destroyOnEmit: false,
    tier: 5,
    madeFrom: 32
});
console.log(item);
