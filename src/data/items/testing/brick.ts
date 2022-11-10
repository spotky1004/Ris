import { Item } from "../essentials.js";
import placeable from "../../../bundles/placeable.js";
import { messages } from "../../messageDatas.js";
import tags from "../../tags.js";

const item = new Item({
  shopable: true,

  name: "Brick",
  effectDescription: `Spawn 1x3 or 3x1 size Wall based on looking direction.\nWall blocks all players.`,
  on: "used",
  timing: "after",
  destroyOnEmit: true,
  tier: 1,
  recipe: [],
  cost: 3,

  onEmit: async ({ game, target }) => {
    const board = game.board;
    const { x: px, y: py } = target;
    const [dx, dy] = target.looking;

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
    const wall = new placeable.main.Wall({
      game,
      x: tx, y: ty,
      owner: target,
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
    
    await game.messageSender.spawn(target, wall, true);
    await game.messageSender.gameScreen();
    return;
  }
});

export default item;
