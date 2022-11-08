import { Item } from "../essentials.js";
import { paramParser, paramPatterns } from "../util/paramParser.js";
import { messages } from "../../messageDatas.js";
import type PlaceableBase from "../../../game/core/PlaceableBase.js";

const item = new Item({
  name: "Ray",
  on: "used",
  timing: "after",
  destroyOnEmit: true,
  tier: 1,
  recipe: [],
  cost: 5,

  onEmit: async ({ game, data }) => {
    const param = paramParser(
      data.param,
      [paramPatterns.boardPosition, paramPatterns.integer]
    );
    if (!param) return {
      errorMsg: messages.item["invaild_param"],
      ignoreDestroyOnEmit: true
    };
    const directionCode = param[1];
    const rPos = param[0][Number(!directionCode)];
    const direction = directionCode ? "V" : "H";

    const board = game.board;
    const { width, height } = board;
    if (board.isOutOfBound(direction === "V" ? rPos: 0, direction === "H" ? rPos : 0)) return {
      errorMsg: messages.item["wrong_position"]("Ray"),
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
