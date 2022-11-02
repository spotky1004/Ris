import { Item } from "../essentials.js";
import placeable from "../../../bundles/placeable.js";

const item = new Item({
  name: "Brick",
  on: "used",
  timing: "after",

  onEmit: async ({ game, owner }) => {
    const board = game.board;
    const { x: px, y: py } = owner;
    const [dx, dy] = owner.looking;

    const [tx, ty] = [px + dx, py + dy];
    const shape: [x: number, y: number][] = Math.abs(dx) > Math.abs(dy) ? [[-1, 0], [1, 0]] : [[0, -1], [0, 1]];

    const placePositions = [[tx, ty], ...shape.map(([sx, sy]) => [tx + sx, ty + sy])] as [x: number, y: number][];
    if (placePositions.some(([x, y]) => {
      return (
        board.isTagInTile(x, y, "solid") ||
        board.isOutOfBound(x, y)
      );
    })) return true;

    new placeable.main.Wall({
      game,
      x: tx, y: ty,
      owner,
      bgColor: "#f57e42",
      wallName: "Wall", name: "Wall A",
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
    return false;
  },
  destroyOnEmit: true,
  tier: 1,
  recipe: [],
  cost: 4
});

export default item;
