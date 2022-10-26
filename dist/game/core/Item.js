export default class Item {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.name = options.name;
        this.unlockedDefault = (_a = options.unlockedDefault) !== null && _a !== void 0 ? _a : true;
        this.recipe = (_b = options.recipe) !== null && _b !== void 0 ? _b : [];
        this.shopable = (_c = options.shopable) !== null && _c !== void 0 ? _c : false;
        this.on = options.on;
        this.timing = options.timing;
        this.chargeOptions = (_d = options.chargeOptions) !== null && _d !== void 0 ? _d : null;
        this.destroyOnEmit = (_e = options.destroyOnEmit) !== null && _e !== void 0 ? _e : false;
        this.onEmit = options.onEmit;
        let tier = (_f = options.tier) !== null && _f !== void 0 ? _f : 1;
        let cost = (_g = options.cost) !== null && _g !== void 0 ? _g : 0;
        if (this.recipe.length > 0) {
            tier = Math.max(...this.recipe.map(item => item.tier)) + 1;
            cost = this.recipe.reduce((a, b) => a + b.cost, 0);
        }
        this.tier = tier;
        this.cost = cost;
    }
}
import Player from "../placeables/Player.js";
const item = new Item({
    name: "Attack Debugger",
    on: "always",
    timing: "after",
    onEmit: async ({ data, event, game, owner }) => {
        if (event === "attacked") {
            if (data.from instanceof Player &&
                owner instanceof Player) {
                await game.sender.send(`${data.from.memberName} attacked ${owner.memberName} for ${data.damage} damage!`);
            }
        }
        const players = game.board.getAllPlaceables("Player");
        await game.sender.send(players.includes(owner) ? "The owner is on the board" : "The owner isn't on the board..?");
        const walls = game.board.getAllPlaceables(/^wall/g);
        await game.sender.send("Walls on the board: " + walls.map(w => w.displayName).join(" "));
    },
    unlockedDefault: false,
    chargeOptions: {
        type: "move",
        length: 3
    },
    destroyOnEmit: false,
    tier: 5,
    recipe: [],
    cost: 32
});
console.log(item);
