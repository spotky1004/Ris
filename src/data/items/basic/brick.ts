import { Item } from "../essentials.js";
import placeable from "../../../bundles/placeable.js";
import { messages } from "../../messageDatas.js";
import tags from "../../tags.js";

const item = new Item({
  shopable: true,

  name: "Brick",
  on: "used",
  timing: "after",
  destroyOnEmit: true,
  tier: 1,
  recipe: [],
  cost: 3,

  onEmit: async ({ game, owner }) => {
    const board = game.board;
    const { x: px, y: py } = owner;
    const [dx, dy] = owner.looking;

    const [tx, ty] = [px + dx, py + dy];
    const shape: [x: number, y: number][] = Math.abs(dx) < Math.abs(dy) ? [[-1, 0], [1, 0]] : [[0, -1], [0, 1]];

    const placePositions = [[tx, ty], ...shape.map(([sx, sy]) => [tx + sx, ty + sy])] as [x: number, y: number][];
    if (placePositions.some(([x, y]) => {
      return (
        board.isTagInTile(x, y, tags.Solid) ||
        board.isOutOfBound(x, y)
      );
    })) {
      return {
        ignoreDestroyOnEmit: true
      };
    }

    const wallName = messages.item["wall"];
    const wallOrder = messages.item["wall_order"];
    new placeable.main.Wall({
      game,
      x: tx, y: ty,
      owner,
      bgColor: "#f57e42",
      wallName, name: wallName + " " + wallOrder[0],
      nameColor: "#fff",
      displayStatus: [
        {
          type: "hp",
          color: "#ddd"
        }
      ],
      shape,
      status: {
        maxHp: 5,
        baseDef: 2
      }
    });
    return;
  }
});

export default item;
