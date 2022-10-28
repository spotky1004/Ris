import { Item } from "../essentials.js";
import Player from "../../placeables/main/Player.js";

const item = new Item({
  name: "Attack Debugger",
  on: "always",
  timing: "after",

  onEmit: async ({ game, data, event, owner }) => {
    if (event === "attacked") {
      if (
        data.from instanceof Player &&
        owner instanceof Player
      ) {
        await game.messageSender.send(`${data.from.memberName} attacked ${owner.memberName} for ${data.damage} damage!`);
      }
    }

    const players = game.board.getAllPlaceables("Player");
    await game.messageSender.send(players.includes(owner) ? "The owner is on the board" : "The owner isn't on the board..?");

    const walls = game.board.getAllPlaceables(/^wall/g);
    await game.messageSender.send("Walls on the board: " + walls.map(w => w.displayName).join(" "));
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

export default item;
