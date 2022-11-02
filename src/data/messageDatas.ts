import type PlaceableBase from "../game/core/PlaceableBase.js";

type ReplacePattern = [pattern: RegExp | string, replaceValue: string];
export const replacePatterns: ReplacePattern[] = [
  [/\$dmg/ig, "**DMG**"],
];

export const messages = {
  game: {
    "attack": (from: PlaceableBase, to: PlaceableBase, dmg: number) => {
      return `**${from.displayName}** attacked **${to.displayName}** with **${dmg}** $DMG`;
    },
    "not_your_turn": () => "Not your turn!",
    "action_count_exceeded": (cur: number, max: number) => `Action count exceeded! (${cur}/${max})`,
    "invaild_move": () => "invaild move",
    "turn_alert": (curPlayer: PlaceableBase) => {
      return `It's ${curPlayer.displayName} turn!`;
    }
  },
  item: {
    "wall" : "Wall",
    "wall_order": ["A", "B", "C", "D", "E", "F", "G", "H"]
  },
  etc: {
    "done": () => "Done!"
  },
  err: {
    "err_unexpected": () => "Unexpected error occured...",
    "err_game_not_started": () => "The game isn't started.",
    "err_game_running": () => "The game is aleady running!",
    "err_member_not_found": () => "Didn't found member...",
  }
};
