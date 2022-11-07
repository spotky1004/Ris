import { Item } from "../essentials.js";

const rayParamPattern = /\d+,\d+,(V|H)/;
const item = new Item({
  name: "Ray",
  on: "used",
  timing: "after",
  destroyOnEmit: true,
  tier: 1,
  recipe: [],
  cost: 2,

  onEmit: async ({ game, data }) => {
    const param = data.param;
    if (!rayParamPattern.test(param)) return {
      errorMsg: "x,y,V or x,y,H",
      ignoreDestroyOnEmit: true
    };
    const params = param.split(",");
    const [rx, ry] = [params[0], params[1]].map(Number);
    const direction = params[2] as "V" | "H";

    const board = game.board;
    if (board.isOutOfBound(rx, ry)) return {
      errorMsg: `(${rx}, ${ry}) is out of bound!`,
      ignoreDestroyOnEmit: true
    };

    const { width, height } = board;
    const attackPoses: [x: number, y: number][] = [];
    if (direction === "H") {
      for (let i = 0; i < width; i++) {
        attackPoses.push([i, ry]);
      }
    } else if (direction === "V") {
      for (let i = 0; i < height; i++) {
        attackPoses.push([rx, i]);
      }
    }

    const canvas = board.canvas;
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
        toAttack.attackedBy("Ray", 1, "normal");
      }
    }

    await game.messageSender.gameScreen();
    return {
      ignoreDestroyOnEmit: false
    };
  }
});

export default item;
