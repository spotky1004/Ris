import ChargeManager from "../util/ChargeManager.js";
import type Game from "./Game.js";
import type PlaceableBase from "./PlaceableBase.js";
import type { TickTypes } from "../util/TickManager.js";
import type {
  default as Item,
  ItemActivateEventNames,
  ItemActivateEventData,
  ItemActivateEventReturn
} from "./Item.js";

export default class WorkingItem<T extends ItemActivateEventNames = any> {
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
      type: "all",
      length: 0
    });
  }

  tick(type: TickTypes) {
    this.tick(type);
  }

  async emit<E extends ItemActivateEventNames>(event: E, data: ItemActivateEventData[E]): Promise<ItemActivateEventReturn[E] | void> {
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
}
