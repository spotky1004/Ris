import TickManager, { TickTypes } from "../util/TickManager.js";
import type Game from "./Game.js";
import type PlaceableBase from "./PlaceableBase.js";
import type Item from "./Item.js";
import type {
  GameEventNames,
  GameEventData,
  ItemGameEventReturn
} from "@typings/GameEvent";

export default class WorkingItem<T extends GameEventNames = any> {
  private game: Game;
  readonly owner: PlaceableBase;
  readonly on: T;
  readonly data: Item<T>;
  readonly chargeTick: TickManager;
  
  constructor(game: Game, owner: PlaceableBase, item: Item<T>) {
    this.game = game;
    this.owner = owner;
    this.on = item.on;
    this.data = item;
    this.chargeTick = new TickManager(item.chargeOptions ?? {
      type: "allTurn",
      length: 0
    });
  }

  tick(type: TickTypes) {
    this.tick(type);
  }

  async emit<E extends GameEventNames>(event: E, timing: "before" | "after", data: GameEventData[E]): Promise<ItemGameEventReturn[E] | void> {
    const { game, owner, on, data: item } = this;
    if (
      // @ts-ignore 'E' and 'T' have no overlap...
      event === on &&
      item.timing === timing
    ) {
      // @ts-ignore why??
      const result = await item.onEmit({ game, target: owner, event, data });
      if (!result?.preventTickRestart) {
        this.chargeTick.restart();
      }
      return result ?? {};
    }
    return;
  }

  isReadyToEmit() {
    return this.chargeTick.isReady();
  }

  getMinifiedInfo() {
    const item = this.data;
    const idx = this.owner.items.findIndex(i => i === this);
    const chargeLen = item.chargeOptions?.length ?? 0;
    const content = `\`#${idx.toString().padStart(2, " ")}\` - ${item.getMinifiedInfo()} ${chargeLen > 0 ? `(CD: **${this.chargeTick.timeLeft}**/${chargeLen})`: ""}`
    return content;
  }
}
