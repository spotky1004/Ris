import { Item, StatusEffect } from "../essentials.js";
import placeable from "../../../bundles/placeable.js";
import { messages } from "../../messageDatas.js";
import tags from "../../tags.js";
import item from "../../../bundles/item.js";
import type PlaceableBase from "../../../game/core/PlaceableBase.js";

const sliding = new StatusEffect({
  id: "sliding",
  displayName: "Sliding",
  alertOnAdded: true,
  on: "allTurnStart",
  timing: "before",
  onEffect: async ({ game, target }) => {
    const board = game.board;
    const [dx, dy] = target.looking;
    const shape = target.getShape();
    const toAttack: PlaceableBase[] = [];
    for (const [sx, sy] of shape) {
      const [tx, ty] = [sx + dx, sy + dy];
      if (board.isOutOfBound(tx, ty)) {
        await target.attackedBy("Sliding", {
          normal: 1
        });
        return;
      }
      const tile = board.getTile(tx, ty);
      for (const placeable of tile) {
        if (placeable !== target && !toAttack.includes(placeable)) {
          toAttack.push(placeable);
        }
      }
    }

    if (toAttack.length > 0) {
      for (const placeable of toAttack) {
        placeable.attackedBy(target, target.status.getDamage());
      }
    } else {
      target.x += dx;
      target.y += dy;
    }
  },
  interval: {
    type: "allTurn",
    length: 1
  },
  remove: {
    type: "allTurn",
    length: 99
  }
})

export default new Item({
  name: "Sliding Brick",
  effectDescription: `Wall, but it's sliding!`,
  on: "used",
  timing: "after",
  destroyOnEmit: true,
  tier: 2,
  recipe: () => [item.testing.Brick, item.t1.MP],

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
        baseDef: 2,
        baseDamage: {
          normal: 2.5
        }
      }
    });
    
    await game.messageSender.spawn(target, wall, true);
    await game.messageSender.gameScreen();
    await wall.status.addStatusEffect(sliding);
    return;
  }
});
