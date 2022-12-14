import { Item } from "../essentials.js";
import { paramParser, paramPatterns, paramPatternDescriptions } from "../util/paramParser.js";
import { messages } from "../../messageDatas.js";
import type PlaceableBase from "../../../game/core/PlaceableBase.js";

const item = new Item({
  name: "Ray",
  effectDescription: "Ray",
  paramDescription: [
    `Position to use Ray.\n${paramPatternDescriptions.boardPosition}`,
    `0 = Horizontal, 1 = Vertical\n${paramPatternDescriptions.zeroOne}`
  ],
  on: "used",
  timing: "after",
  destroyOnEmit: true,
  tier: 1,
  recipe: [],
  cost: 5,

  onEmit: async ({ game, data }) => {
    const param = paramParser(
      data.param,
      [paramPatterns.boardPosition, paramPatterns.zeroOne]
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
      canvas.addRenderItem("block", 15, {
        layer: 1,
        color: "#f0d343",
        x: ax, y: ay
      });
      const tile = board.getTile(ax, ay);
      for (const toAttack of tile) {
        if (attacked.includes(toAttack)) continue;
        attacked.push(toAttack);
        toAttack.attackedBy("Ray", {
          normal: 1
        });
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
