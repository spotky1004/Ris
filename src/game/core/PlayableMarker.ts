import PlaceableBase, { PlaceableBaseOptions } from "./PlaceableBase.js";
import type Player from "./Player.js";
import type { default as Item, ItemActivateEventReturn } from "./Item.js";
import type WorkingItem from "./WorkingItem.js";

export interface PlayerMoveReturn {
  moveSuccess: boolean;
  attack: boolean
}
export interface PlayableMarkerOptions extends PlaceableBaseOptions {
  player: Player;
}

export default class PlayableMarker extends PlaceableBase {
  player: Player;

  constructor(options: PlayableMarkerOptions) {
    super(options);

    this.player = options.player;
  }

  move(x: number, y: number): PlayerMoveReturn {
    this.x += x;
    this.y += y;
    this.player.actionDid.move = true;
    this.player.actionCountLeft--;
    this.game.emitMoveTick(this.player);
    return {
      moveSuccess: true,
      attack: false
    };
  }

  look(x: number, y: number) {
    this.looking = [Math.sign(x) as -1 | 0 | 1, Math.sign(y) as -1 | 0 | 1];
  }

  buyItem(item: Item, count: number = 1) {
    count = Math.floor(count);
    const cost = item.cost * count;
    if (cost > this.player.money) return false;
    this.player.money -= cost;
    for (let i = 0; i < count; i++) {
      this.addItem(item);
    }
    return true;
  }

  async useItem(idx: number, param: string[] = []): Promise<[WorkingItem<"used">, ItemActivateEventReturn["used"]] | null> {
    const item = this.items[idx];
    if (!item || item.on !== "used") return null;
    const result = await item.emit("used", { param }) ?? {};
    if (result.errorMsg) {
      return [item, result];
    }
    this.player.actionCountLeft--;
    if (!result.ignoreDestroyOnEmit) {
      this.removeItem(item);
    }
    return [item, result];
  }

  mergeItem(idxes: number[]) {
    const isIdxDupe = idxes.length !== new Set(idxes).size;
    if (isIdxDupe) return false;

    const toMerge = idxes.map(idx => this.items[idx]);
    const isIdxInvaild = toMerge.length !== toMerge.filter(v => typeof v !== "undefined").length;
    if (isIdxInvaild) return false;

    const mergeResult = this.game.gameManager.itemManager.tryMerge(...toMerge.map(i => i.data));
    if (mergeResult === null) return null;
    for (const item of toMerge) {
      this.removeItem(item);
    }
    this.addItem(mergeResult);
    return mergeResult;
  }

  death() {
    this.despawn();
    this.game.messageSender.death(this);
    this.player.defeated = true;
  }
}
