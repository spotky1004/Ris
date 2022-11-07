import { Item } from "../essentials.js";
import type PlaceableBase from "../../../game/core/PlaceableBase.js";

const rayParamPattern = /\d+,(V|H)/;
const item = new Item({
  name: "Ray",
  on: "used",
  timing: "after",
  destroyOnEmit: true,
  tier: 1,
  recipe: [],
  cost: 5,

  onEmit: async ({ game, data }) => {
    const param = data.param;
    if (!rayParamPattern.test(param)) return {
      errorMsg: "x,V or y,H",
      ignoreDestroyOnEmit: true
    };
    const params = param.split(",");
    const rPos = Number(params[0]) - 1;
    const direction = params[1] as "V" | "H";

    const board = game.board;
    const { width, height } = board;
    if (board.isOutOfBound(direction === "V" ? rPos: 0, direction === "H" ? rPos : 0)) return {
      errorMsg: `Cannot use ray on that position!`,
      ignoreDestroyOnEmit: true
    };

    const attackPoses: [x: number, y: number][] = [];
    if (direction === "H") {
      for (let i = 0; i < width; i++) {
        attackPoses.push([i, rPos]);
      }
    } else if (direction === "V") {
      for (let i = 0; i < height; i++) {
        attackPoses.push([rPos, i]);
      }
    }

    const canvas = board.canvas;
    const attacked: PlaceableBase[] = [];
    for (const [ax, ay] of attackPoses) {
      canvas.addRenderItem("basicPlaceable", 15, {
        bgColor: "#f0d343",
        x: ax, y: ay,
        name: {
          text: "",
          color: ""
        },
        numbers: []
      });
      const tile = board.getTile(ax, ay);
      for (const toAttack of tile) {
        if (attacked.includes(toAttack)) continue;
        attacked.push(toAttack);
        toAttack.attackedBy("Ray", 1, "normal");
      }
    }

    const isH = direction === "H";
    await game.messageSender.gameScreen([
      isH ? 0 : rPos, isH ? rPos : 0,
      isH ? width : 1, isH ? 1 : height
    ]);
    return {
      ignoreDestroyOnEmit: false
    };
  }
});

export default item;
