import { Item } from "../essentials.js";
import PlayerMarker from "../../placeables/main/PlayerMarker.js";

const item = new Item({
  name: "Attack Debugger",
  on: "always",
  timing: "after",

  onEmit: async ({ game, data, event, target }) => {
    if (event === "attacked") {
      if (
        data.from instanceof PlayerMarker &&
        target instanceof PlayerMarker
      ) {
        await game.messageSender.send(`${data.from.memberName} attacked ${target.memberName} for ${data.damage} damage!`);
      }
    }

    const players = game.board.getAllPlaceables({
      toSearch: "type",
      value: "Player"
    });
    await game.messageSender.send(players.includes(target) ? "The owner is on the board" : "The owner isn't on the board..?");

    const walls = game.board.getAllPlaceables({
      toSearch: "type",
      value: /^wall/g
    });
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

export default item;
