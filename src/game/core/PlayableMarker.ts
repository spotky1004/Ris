import PlaceableBase, { PlaceableBaseOptions } from "./PlaceableBase.js";
import type Player from "./Player.js";
import type Item from "./Item.js";
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

  mergeItems(...items: Item[]) {
    const itemToFind = items.map(item => item.name);
    let workingItems: WorkingItem[] = [];
    loop: while (itemToFind.length > 0) {
      for (const workingItem of this.items) {
        if (workingItems.includes(workingItem)) {
          continue;
        }
        if (itemToFind.includes(workingItem.data.name)) {
          workingItems.push(workingItem);
          const idxToSplice = itemToFind.findIndex(name => name === workingItem.data.name);
          itemToFind.splice(idxToSplice, 1);
          continue loop;
        }
      }
      return false;
    }
    const mergeResult = this.game.gameManager.itemManager.tryMerge(...workingItems.map(i => i.data));
    if (mergeResult === null) return false;
    for (const workingItem of workingItems) {
      this.removeItem(workingItem);
    }
    this.addItem(mergeResult);
    return true;
  }

  death() {
    this.despawn();
    this.game.messageSender.death(this);
    this.player.defeated = true;
  }
}
