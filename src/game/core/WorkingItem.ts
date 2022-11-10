import ChargeManager from "../util/ChargeManager.js";
import type Game from "./Game.js";
import type PlaceableBase from "./PlaceableBase.js";
import type { TickTypes } from "../util/TickManager.js";
import type Item from "./Item.js";
import type {
  GameEventNames,
  GameEventData,
  GameEventReturn
} from "@typings/GameEvent";

export default class WorkingItem<T extends GameEventNames = any> {
  private game: Game;
  readonly owner: PlaceableBase;
  readonly on: T;
  readonly data: Item<T>;
  readonly chargeTick: ChargeManager;
  
  constructor(game: Game, owner: PlaceableBase, item: Item<T>) {
    this.game = game;
    this.owner = owner;
    this.on = item.on;
    this.data = item;
    this.chargeTick = new ChargeManager(item.chargeOptions ?? {
      type: "allTurn",
      length: 0
    });
  }

  tick(type: TickTypes) {
    this.tick(type);
  }

  async emit<E extends GameEventNames>(event: E, data: GameEventData[E]): Promise<GameEventReturn[E] | void> {
    const { game, owner, on, data: item } = this;
    if (
      // @ts-ignore 'E' and 'T' have no overlap...
      event === on &&
      this.chargeTick.timeLeft <= 0
    ) {
      // @ts-ignore why??
      const result = item.onEmit({ game, owner, event, data });
      // @ts-ignore
      return result ?? {};
    }
    return;
  }

  getMinifiedInfo() {
    const item = this.data;
    const idx = this.owner.items.findIndex(i => i === this);
    const chargeLen = item.chargeOptions?.length ?? 0;
    const content = `\`#${idx.toString().padStart(2, " ")}\` - ${item.getMinifiedInfo()} ${chargeLen > 0 ? `(CD: **${this.chargeTick.timeLeft}**/${chargeLen})`: ""}`
    return content;
  }
}
