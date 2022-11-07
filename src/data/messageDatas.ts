import type Item from "../game/core/Item.js";
import type PlaceableBase from "../game/core/PlaceableBase.js";
import type Player from "../game/core/Player.js";

type ReplacePattern = [pattern: RegExp | string, replaceValue: string];
export const replacePatterns: ReplacePattern[] = [
  [/\$dmg/ig, "**DMG**"],
];

export const messages = {
  game: {
    "atk": "ATK",
    "def": "DEF",
    "attack": (from: PlaceableBase, to: PlaceableBase, dmg: number) => {
      return `**${from.displayName}** attacked **${to.displayName}** with **${dmg}** $DMG`;
    },
    "death": (placeable: PlaceableBase) => {
      return `**${placeable.displayName}** eliminated!`;
    },
    "not_your_turn": "Not your turn!",
    "action_count_exceeded": (cur: number, max: number) => `Action count exceeded! (${cur}/${max})`,
    "invaild_move": "invaild move",
    "turn_alert": (curPlayer: Player) => {
      return `It's ${curPlayer.pingString} turn!`;
    },
    "item": "item", // must be lowercase (or other language)
    "money": "Money",
    "turn_end": (moneyGot: number) => `Turn end. (${messages.game["money"]} +**${moneyGot}**)`,
  },
  command: {
    "buy_command_param_desc": "Name of the item to buy",
    "buy_success": (player: Player, itemBought: Item) => {
      return `You successfully bought **${itemBought.name}** for **${itemBought.cost}** ${messages.game["money"]}\nNow, you have **${player.money}** ${messages.game["money"]}.`;
    },
    "buy_fail": (player: Player, item: Item) => {
      return `You cannot afford **${item.name}**. (${player.money}/**${item.cost}**)`
    },
    "use_command_param_desc": "Index of the item to use. (use /status to see index)",
    "use_success": (item: Item) => `Successfully used **${item.name}**!`,
    "use_fail": "Invaild use",
  },
  etc: {
    "done": "Done!"
  },
  err: {
    "err_unexpected": "Unexpected error occured...",
    "err_game_not_started": "The game isn't started.",
    "err_game_running": "The game is aleady running!",
    "err_member_not_found": "Didn't found member...",
    "err_not_playing": "You are not player!",
  },
  item: {
    "tier_order": ["I", "II", "III", "IV", "V", "VI", "VII"],
    "wall" : "Wall",
    "wall_order": ["A", "B", "C", "D", "E", "F", "G", "H"],
  },
};
