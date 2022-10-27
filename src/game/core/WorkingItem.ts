import ChargeManager from "../etc/ChargeManager.js";
import type Game from "./Game.js";
import type PlaceableBase from "./PlaceableBase.js";
import type { TickTypes } from "../etc/TickManager.js";
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
  readonly item: Item<T>;
  readonly chargeTick: ChargeManager;
  
  constructor(game: Game, owner: PlaceableBase, item: Item<T>) {
    this.game = game;
    this.owner = owner;
    this.on = item.on;
    this.item = item;
    this.chargeTick = new ChargeManager(item.chargeOptions ?? {
      type: "all",
      length: 0
    });
  }

  tick(type: TickTypes) {
    this.tick(type);
  }

  emit<E extends ItemActivateEventNames>(event: E, data: ItemActivateEventData[E]): ItemActivateEventReturn[T] | void {
    const { game, owner, on, item } = this;
    if (
      // @ts-ignore 'E' and 'T' have no overlap...
      event === on &&
      this.chargeTick.timeLeft <= 0
    ) {
      // @ts-ignore why??
      const result = item.onEmit({ game, owner, event, data });
      return result;
    }
    return;
  }
}